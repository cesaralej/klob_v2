
import { createClient } from '@/lib/supabase/server'
import { parseSpreadsheet } from '@/lib/parser'
import { validateAndNormalize } from '@/lib/validator'
import { trackEvent, MONITORING_EVENTS, trackError } from '@/lib/monitoring'

export async function POST(req: Request) {
  const supabase = await createClient()
  
  // Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }
    
    trackEvent(MONITORING_EVENTS.UPLOAD.STARTED, { userId: user.id, fileName: file.name })

    // 1. Buffer & Parse
    const buffer = await file.arrayBuffer()
    const rawData = await parseSpreadsheet(buffer)
    
    if (!rawData || rawData.length === 0) {
        return Response.json({ error: 'Empty file' }, { status: 400 })
    }

    // 2. Validate
    const { validRows, errors } = validateAndNormalize(rawData)
    
    if (errors.length > 0) {
        // Fail fast logic? "Warnings allowed but must be explicit... Fail fast if schema is invalid"
        // If many errors, fail. If few? User said: "Data looks wrong, users must re-upload."
        // We will fail on ANY critical error for now to enforce quality.
        return Response.json({ error: 'Validation Failed', details: errors.slice(0, 10) }, { status: 400 })
    }

    // 3. Ingest (Transactional RPC)
    const { data: uploadId, error: dbError } = await supabase.rpc('ingest_upload', {
        p_user_id: user.id,
        p_rows: validRows
    })

    if (dbError) {
        throw new Error(dbError.message)
    }

    trackEvent(MONITORING_EVENTS.UPLOAD.SUCCESS, { userId: user.id, uploadId, rowCount: validRows.length })

    return Response.json({ success: true, uploadId, rowCount: validRows.length })
    
  } catch (err: any) {
    console.error('Upload error:', err)
    trackError(err, { userId: user.id })
    trackEvent(MONITORING_EVENTS.UPLOAD.FAILURE, { userId: user.id, error: err.message })
    return Response.json({ error: 'Internal Server Error', details: err.message }, { status: 500 })
  }
}
