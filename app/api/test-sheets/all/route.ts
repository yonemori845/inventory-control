import { NextResponse } from 'next/server'
import { readSheet } from '@/lib/google-sheets/read'
import { getSheetsClient } from '@/lib/google-sheets/client'

/** 全シートのヘッダー構造を取得（列構成の確認用） */
export async function GET() {
  try {
    const sheets = await getSheetsClient()
    const spreadsheetId = process.env.SPREADSHEET_ID!

    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId })
    const sheetNames: string[] =
      spreadsheet.data.sheets?.map((s) => s.properties?.title).filter((t): t is string => !!t) ?? []

    const result: Record<string, { headers: string[]; sampleRow?: string[] }> = {}

    for (const sheetName of sheetNames) {
      try {
        const data = await readSheet(sheetName)
        const headers = data[0] || []
        const sampleRow = data[1]
        result[sheetName] = { headers, sampleRow }
      } catch (err) {
        result[sheetName] = {
          headers: [],
          sampleRow: undefined,
          error: err instanceof Error ? err.message : 'Unknown',
        } as any
      }
    }

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('エラー:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
