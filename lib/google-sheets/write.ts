import { getSheetsClient } from './client'

export async function appendRow(sheetName: string, values: any[]) {
  const sheets = await getSheetsClient()
  const spreadsheetId = process.env.SPREADSHEET_ID!
  
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:Z`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [values] },
  })
}

export async function updateRow(
  sheetName: string,
  rowIndex: number,
  values: any[]
) {
  const sheets = await getSheetsClient()
  const spreadsheetId = process.env.SPREADSHEET_ID!
  
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${sheetName}!A${rowIndex}:Z${rowIndex}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [values] },
  })
}

export async function deleteRow(sheetName: string, rowIndex: number) {
  const sheets = await getSheetsClient()
  const spreadsheetId = process.env.SPREADSHEET_ID!
  
  // シートIDを取得
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId,
  })
  
  const sheet = spreadsheet.data.sheets?.find(
    s => s.properties?.title === sheetName
  )
  
  if (!sheet?.properties?.sheetId) {
    throw new Error(`Sheet "${sheetName}" not found`)
  }
  
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: sheet.properties.sheetId,
              dimension: 'ROWS',
              startIndex: rowIndex - 1,
              endIndex: rowIndex,
            },
          },
        },
      ],
    },
  })
}
