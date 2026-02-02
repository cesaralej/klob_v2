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
    
    console.log(`[Upload] Starting upload for file: ${file.name}, size: ${(file.size / 1024).toFixed(2)} KB, type: ${file.type}`)
    trackEvent(MONITORING_EVENTS.UPLOAD.STARTED, { userId: user.id, fileName: file.name })

    // 1. Buffer & Parse
    console.log('[Upload] Parsing spreadsheet...')
    const buffer = await file.arrayBuffer()
    const rawData = await parseSpreadsheet(buffer)
    
    console.log(`[Upload] Parsed raw data - Sales rows: ${rawData.sales.length}, Products rows: ${rawData.products.length}, Transfers rows: ${rawData.transfers.length}`)
    
    // Log sample headers for debugging
    if (rawData.sales.length > 0) {
      console.log('[Upload] Sales sheet headers:', Object.keys(rawData.sales[0]))
    }
    if (rawData.products.length > 0) {
      console.log('[Upload] Products sheet headers:', Object.keys(rawData.products[0]))
    }
    if (rawData.transfers.length > 0) {
      console.log('[Upload] Transfers sheet headers:', Object.keys(rawData.transfers[0]))
    }
    
    // Check if we got anything
    if (rawData.sales.length === 0 && rawData.products.length === 0 && rawData.transfers.length === 0) {
        console.log('[Upload] No data found in any sheet')
        return Response.json({ error: 'Empty file or no recognizable sheets found' }, { status: 400 })
    }

    // 2. Validate
    console.log('[Upload] Validating and normalizing data...')
    const { sales, products, transfers, errors } = validateAndNormalize(rawData)
    
    console.log(`[Upload] Validation complete - Valid Sales: ${sales.length}, Valid Products: ${products.length}, Valid Transfers: ${transfers.length}, Errors: ${errors.length}`)
    
    if (errors.length > 0) {
        console.log('[Upload] Validation errors:', errors.slice(0, 10))
    }
    
    // Log a sample validated row for debugging
    if (sales.length > 0) {
      console.log('[Upload] Sample validated sale:', JSON.stringify(sales[0], null, 2))
    }
    
    const validCount = sales.length + products.length + transfers.length
    
    if (errors.length > 0) {
        console.log(`[Upload] Returning validation failure with ${errors.length} errors`)
        return Response.json({ 
            error: 'Validation Failed', 
            details: errors.slice(0, 20),
            stats: { validSales: sales.length, validProducts: products.length, validTransfers: transfers.length }
        }, { status: 400 })
    }

    if (validCount === 0) {
         console.log('[Upload] No valid rows to ingest')
         return Response.json({ error: 'No valid rows found to ingest' }, { status: 400 })
    }

    // 3. Batch Ingest
    console.log(`[Upload] Starting batch ingestion...`)
    
    // A. Create Upload Record
    const { data: uploadData, error: uploadError } = await supabase
        .from('uploads')
        .insert({
            user_id: user.id,
            filename: file.name,
            status: 'processing',
            sales_count: sales.length,
            products_count: products.length,
            transfers_count: transfers.length
        })
        .select()
        .single()
        
    if (uploadError || !uploadData) {
        throw new Error(`Failed to create upload record: ${uploadError?.message}`)
    }
    
    const uploadId = uploadData.id
    console.log(`[Upload] Created upload record: ${uploadId}`)

    // Helper for batching
    const BATCH_SIZE = 2000
    const userId = user.id
    
    async function insertBatch(table: string, data: any[]) {
        if (data.length === 0) return
        console.log(`[Upload] Inserting ${data.length} rows into ${table}...`)
        
        for (let i = 0; i < data.length; i += BATCH_SIZE) {
            const chunk = data.slice(i, i + BATCH_SIZE).map(row => ({
                ...row,
                user_id: userId,
                upload_id: uploadId
            }))
            
            const { error } = await supabase.from(table).insert(chunk)
            if (error) throw new Error(`Batch insert failed for ${table}: ${error.message}`)
            console.log(`[Upload]   Inserted batch ${i} - ${i + chunk.length} for ${table}`)
        }
    }

    try {
        await insertBatch('sales', sales)
        await insertBatch('products', products)
        await insertBatch('transfers', transfers)
        
        // Update status to completed
        const { error: updateError } = await supabase
            .from('uploads')
            .update({ status: 'completed' })
            .eq('id', uploadId)
            
        if (updateError) console.error('[Upload] Failed to update status to completed:', updateError)

        console.log(`[Upload] Ingestion complete for Upload ID: ${uploadId}`)
        
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
        console.error('[Upload] Batch ingestion failed:', err)
        // Attempt to mark as failed
        await supabase.from('uploads').update({ status: 'failed' }).eq('id', uploadId)
        // Optional: Delete partial data? For now just mark failed.
        throw err 
    }
    
  } catch (err: any) {
    console.error('Upload error:', err)
    trackError(err, { userId: user.id })
    trackEvent(MONITORING_EVENTS.UPLOAD.FAILURE, { userId: user.id, error: err.message })
    return Response.json({ error: 'Internal Server Error', details: err.message }, { status: 500 })
  }
}
