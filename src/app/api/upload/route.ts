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
    
    // Check if we got anything
    if (rawData.sales.length === 0 && rawData.products.length === 0 && rawData.transfers.length === 0) {
        return Response.json({ error: 'Empty file or no recognizable sheets found' }, { status: 400 })
    }

    // 2. Validate
    const { sales, products, transfers, errors } = validateAndNormalize(rawData)
    
    // Fail fast if too many errors? 
    // "Fail on ANY critical error for now to enforce quality." - preserving previous logic intent
    // But we might want to return warnings.
    // Let's fail if we extracted NOTHING valid but had errors.
    
    const validCount = sales.length + products.length + transfers.length
    
    if (errors.length > 0) {
        // If critical errors exist
        // Return 400 with details
        return Response.json({ 
            error: 'Validation Failed', 
            details: errors.slice(0, 20),
            stats: { validSales: sales.length, validProducts: products.length, validTransfers: transfers.length }
        }, { status: 400 })
    }

    if (validCount === 0) {
         return Response.json({ error: 'No valid rows found to ingest' }, { status: 400 })
    }

    // 3. Ingest (Transactional RPC)
    const { data: uploadId, error: dbError } = await supabase.rpc('ingest_upload', {
        p_user_id: user.id,
        p_sales: sales,
        p_products: products,
        p_transfers: transfers
    })

    if (dbError) {
        throw new Error(dbError.message)
    }

    trackEvent(MONITORING_EVENTS.UPLOAD.SUCCESS, { 
        userId: user.id, 
        uploadId, 
        salesCount: sales.length,
        productsCount: products.length,
        transfersCount: transfers.length
    })

    return Response.json({ 
        success: true, 
        uploadId, 
        counts: {
            sales: sales.length,
            products: products.length,
            transfers: transfers.length
        }
    })
    
  } catch (err: any) {
    console.error('Upload error:', err)
    trackError(err, { userId: user.id })
    trackEvent(MONITORING_EVENTS.UPLOAD.FAILURE, { userId: user.id, error: err.message })
    return Response.json({ error: 'Internal Server Error', details: err.message }, { status: 500 })
  }
}
