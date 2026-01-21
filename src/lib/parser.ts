import { read, utils } from 'xlsx'

export interface RawDatasets {
  sales: any[]
  products: any[]
  transfers: any[]
}

export async function parseSpreadsheet(fileBuffer: ArrayBuffer): Promise<RawDatasets> {
  const wb = read(fileBuffer, { type: 'buffer', cellDates: true, sheetStubs: true })
  
  // Sheet Detection Logic
  // Keywords:
  // Sheet 1: Sales -> "ventas"
  // Sheet 2: Products -> "compra"
  // Sheet 3: Transfers -> "traspasos"
  
  let salesSheetName = ''
  let productsSheetName = ''
  let transfersSheetName = ''
  
  const sheetNames = wb.SheetNames
  
  // Try keyword matching
  salesSheetName = sheetNames.find(n => n.toLowerCase().includes('ventas')) || ''
  productsSheetName = sheetNames.find(n => n.toLowerCase().includes('compra')) || ''
  transfersSheetName = sheetNames.find(n => n.toLowerCase().includes('traspasos')) || ''
  
  // Fallback to indices if not found
  if (!salesSheetName && sheetNames.length > 0) salesSheetName = sheetNames[0]
  if (!productsSheetName && sheetNames.length > 1) productsSheetName = sheetNames[1]
  if (!transfersSheetName && sheetNames.length > 2) transfersSheetName = sheetNames[2]
  
  const result: RawDatasets = {
    sales: [],
    products: [],
    transfers: []
  }
  
  if (salesSheetName && wb.Sheets[salesSheetName]) {
    result.sales = utils.sheet_to_json(wb.Sheets[salesSheetName], { defval: null })
  }
  
  if (productsSheetName && wb.Sheets[productsSheetName]) {
    result.products = utils.sheet_to_json(wb.Sheets[productsSheetName], { defval: null })
  }
  
  if (transfersSheetName && wb.Sheets[transfersSheetName]) {
    result.transfers = utils.sheet_to_json(wb.Sheets[transfersSheetName], { defval: null })
  }
  
  return result
}
