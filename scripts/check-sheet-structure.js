/**
 * スプレッドシートの全シート構造を確認するスクリプト
 * 実行: node scripts/check-sheet-structure.js
 * ※ .env.local が読み込まれるように、プロジェクトルートで実行してください
 */
require('dotenv').config({ path: '.env.local' })
const { google } = require('googleapis')
const path = require('path')

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.resolve(process.cwd(), 'service-account.json'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })
  const sheets = google.sheets({ version: 'v4', auth })
  const spreadsheetId = process.env.SPREADSHEET_ID

  if (!spreadsheetId) {
    console.error('SPREADSHEET_ID が設定されていません')
    process.exit(1)
  }

  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId })
  const sheetNames = spreadsheet.data.sheets?.map(s => s.properties?.title) || []

  console.log('=== スプレッドシート構造 ===\n')

  for (const sheetName of sheetNames) {
    try {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A1:Z5`,
      })
      const rows = res.data.values || []
      const headers = rows[0] || []

      console.log(`【${sheetName}】`)
      console.log('  ヘッダー:', headers.join(' | '))
      console.log('  列数:', headers.length)
      if (rows.length > 1) {
        console.log('  サンプル行:', rows[1]?.join(' | ') || '(空)')
      }
      console.log('')
    } catch (err) {
      console.log(`【${sheetName}】 エラー:`, err.message)
      console.log('')
    }
  }
}

main().catch(console.error)
