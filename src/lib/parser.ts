import { read, utils } from 'xlsx'

export interface RawDatasets {
  sales: any[]
  products: any[]
  transfers: any[]
}

export async function parseSpreadsheet(fileBuffer: ArrayBuffer): Promise<RawDatasets> {
  const wb = read(fileBuffer, { type: 'buffer', cellDates: true, sheetStubs: true })
  
  const sheetNames = wb.SheetNames
  console.log(`[Parser] Found ${sheetNames.length} sheet(s):`, sheetNames)
  
  // Sheet Detection Logic
  // Keywords:
  // Sheet 1: Sales -> "ventas"
  // Sheet 2: Products -> "compra"
  // Sheet 3: Transfers -> "traspasos"
  
  let salesSheetName = ''
  let productsSheetName = ''
  let transfersSheetName = ''
  
  // Try keyword matching
  salesSheetName = sheetNames.find(n => n.toLowerCase().includes('ventas')) || ''
  productsSheetName = sheetNames.find(n => n.toLowerCase().includes('compra')) || ''
  transfersSheetName = sheetNames.find(n => n.toLowerCase().includes('traspasos')) || ''
  
  console.log(`[Parser] Keyword matching - Sales: "${salesSheetName || 'not found'}", Products: "${productsSheetName || 'not found'}", Transfers: "${transfersSheetName || 'not found'}"`)
  
  // Fallback to indices if not found
  if (!salesSheetName && sheetNames.length > 0) {
    salesSheetName = sheetNames[0]
    console.log(`[Parser] Fallback: Using index 0 for Sales -> "${salesSheetName}"`)
  }
  if (!productsSheetName && sheetNames.length > 1) {
    productsSheetName = sheetNames[1]
    console.log(`[Parser] Fallback: Using index 1 for Products -> "${productsSheetName}"`)
  }
  if (!transfersSheetName && sheetNames.length > 2) {
    transfersSheetName = sheetNames[2]
    console.log(`[Parser] Fallback: Using index 2 for Transfers -> "${transfersSheetName}"`)
  }
  
  const result: RawDatasets = {
    sales: [],
    products: [],
    transfers: []
  }
  
  if (salesSheetName && wb.Sheets[salesSheetName]) {
    result.sales = utils.sheet_to_json(wb.Sheets[salesSheetName], { defval: null })
    console.log(`[Parser] Extracted ${result.sales.length} rows from Sales sheet "${salesSheetName}"`)
  }
  
  if (productsSheetName && wb.Sheets[productsSheetName]) {
    result.products = utils.sheet_to_json(wb.Sheets[productsSheetName], { defval: null })
    console.log(`[Parser] Extracted ${result.products.length} rows from Products sheet "${productsSheetName}"`)
  }
  
  if (transfersSheetName && wb.Sheets[transfersSheetName]) {
    result.transfers = utils.sheet_to_json(wb.Sheets[transfersSheetName], { defval: null })
    console.log(`[Parser] Extracted ${result.transfers.length} rows from Transfers sheet "${transfersSheetName}"`)
  }
  
  return result
}
