import { getSheetsClient } from './client'

export async function readSheet(sheetName: string, range?: string) {
  const sheets = await getSheetsClient()
  const spreadsheetId = process.env.SPREADSHEET_ID!
  
  const rangeString = range ? `${sheetName}!${range}` : `${sheetName}!A:Z`
  
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: rangeString,
  })
  
  return response.data.values || []
}

export async function getSheetHeaders(sheetName: string): Promise<string[]> {
  const allData = await readSheet(sheetName)
  if (allData.length === 0) return []
  return (allData[0] || []).map((h: unknown) => String(h || '').trim())
}

export async function readSheetRows(sheetName: string, startRow: number = 1, endRow?: number) {
  const allData = await readSheet(sheetName)
  if (allData.length === 0) return []
  
  const headers = allData[0]
  const dataRows = allData.slice(startRow, endRow)
  
  return dataRows.map(row => {
    const obj: Record<string, unknown> = {}
    headers.forEach((header: string, index: number) => {
      const val = row[index]
      obj[header] = val !== undefined && val !== null && val !== '' ? val : ''
    })
    return obj
  })
}
