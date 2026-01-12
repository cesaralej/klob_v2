
export interface NormalizedRow {
  sale_date: string // ISO date string
  sku: string
  product_id?: string // Optional, we might generate or lookup
  size?: string
  quantity: number
  net_revenue: number
  product_name?: string
  category?: string
}

export function validateAndNormalize(rows: any[]): { validRows: NormalizedRow[], errors: string[] } {
  const validRows: NormalizedRow[] = []
  const errors: string[] = []

  rows.forEach((row, index) => {
    const rowNum = index + 2 // Assuming header is row 1
    
    // 1. Basic Existence Checks
    // Supporting case-insensitive keys could be added here, currently assuming strict keys from prompt
    // "sale_date", "sku", "quantity", "net_revenue"
    
    // Normalize keys to lowercase?
    // Let's do a quick normalization pass on keys
    const normalizedKeyRow: any = {}
    Object.keys(row).forEach(k => {
        normalizedKeyRow[k.toLowerCase().trim()] = row[k]
    })
    
    const saleDateRaw = normalizedKeyRow['sale_date'] || normalizedKeyRow['date']
    const sku = normalizedKeyRow['sku']
    const quantityRaw = normalizedKeyRow['quantity'] || normalizedKeyRow['qty']
    const revenueRaw = normalizedKeyRow['net_revenue'] || normalizedKeyRow['revenue'] || normalizedKeyRow['amount']
    
    if (!saleDateRaw || !sku || quantityRaw == null || revenueRaw == null) {
        errors.push(`Row ${rowNum}: Missing required fields (Needs: sale_date, sku, quantity, net_revenue)`)
        return
    }

    // 2. Type Coercion & Validation
    
    // Date
    // Excel dates are numbers (days since 1900), text dates are strings.
    // SheetJS tries to parse, but let's be safe.
    let saleDateStr = ''
    try {
       // Simple check: if it looks like a date object
       if (saleDateRaw instanceof Date) {
           saleDateStr = saleDateRaw.toISOString().split('T')[0]
       } else {
           const d = new Date(saleDateRaw)
           if (isNaN(d.getTime())) {
               throw new Error('Invalid Date')
           }
           saleDateStr = d.toISOString().split('T')[0]
       }
    } catch {
       errors.push(`Row ${rowNum}: Invalid date format '${saleDateRaw}'`)
       return 
    }
    
    // Numbers
    const quantity = Number(quantityRaw)
    const revenue = Number(revenueRaw)
    
    if (isNaN(quantity)) {
        errors.push(`Row ${rowNum}: Invalid quantity '${quantityRaw}'`)
        return
    }
    if (isNaN(revenue)) {
        errors.push(`Row ${rowNum}: Invalid revenue '${revenueRaw}'`)
        return
    }

    // 3. Construct Normalized Object
    validRows.push({
        sale_date: saleDateStr,
        sku: String(sku).trim(),
        quantity,
        net_revenue: revenue,
        size: normalizedKeyRow['size'] ? String(normalizedKeyRow['size']) : undefined,
        product_name: normalizedKeyRow['product_name'] || normalizedKeyRow['name'],
        category: normalizedKeyRow['category']
    })
  })

  return { validRows, errors }
}
