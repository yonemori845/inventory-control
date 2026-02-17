import { google } from 'googleapis'
import { getAuth } from './auth'

export async function getSheetsClient() {
  const auth = await getAuth()
  return google.sheets({ version: 'v4', auth })
}
