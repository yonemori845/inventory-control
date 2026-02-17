import { google } from 'googleapis'

/**
 * Google Sheets API の認証
 * - ローカル: GOOGLE_APPLICATION_CREDENTIALS（ファイルパス）
 * - Vercel等: GOOGLE_SERVICE_ACCOUNT_JSON（JSON文字列を環境変数に設定）
 */
export function getAuth() {
  const jsonCreds = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (jsonCreds) {
    try {
      const credentials = JSON.parse(jsonCreds)
      return new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      })
    } catch {
      console.error('GOOGLE_SERVICE_ACCOUNT_JSON のパースに失敗しました')
    }
  }
  return new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
}
