import { read, utils } from 'xlsx'

export interface ParsedRow {
  [key: string]: any
}

export async function parseSpreadsheet(fileBuffer: ArrayBuffer): Promise<ParsedRow[]> {
  const wb = read(fileBuffer, { type: 'buffer', cellDates: true })
  
  // Assume first sheet is the target
  const sheetName = wb.SheetNames[0]
  const sheet = wb.Sheets[sheetName]
  
  // Convert to JSON
  // defval: '' ensures empty cells aren't skipped (keeps row objects consistent keys if possible, though utils.sheet_to_json handles sparse well)
  const data = utils.sheet_to_json(sheet, { defval: null }) as ParsedRow[]
  
  return data
}
