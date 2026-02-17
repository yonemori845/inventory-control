import { NextResponse } from 'next/server'
import { readSheet } from '@/lib/google-sheets/read'
import { getSheetsClient } from '@/lib/google-sheets/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sheetName = searchParams.get('sheet') || 'products'
  
  try {
    // まず、スプレッドシートにアクセスできるか確認
    const sheets = await getSheetsClient()
    const spreadsheetId = process.env.SPREADSHEET_ID!
    
    // スプレッドシートのメタデータを取得して確認
    let spreadsheetInfo
    try {
      const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId,
      })
      spreadsheetInfo = {
        title: spreadsheet.data.properties?.title,
        sheets: spreadsheet.data.sheets?.map(s => ({
          title: s.properties?.title,
          sheetId: s.properties?.sheetId,
        })) || [],
      }
    } catch (metaError) {
      return NextResponse.json(
        {
          success: false,
          message: 'スプレッドシートへのアクセスに失敗しました',
          error: metaError instanceof Error ? metaError.message : 'Unknown error',
          details: {
            spreadsheetId,
            errorType: 'SPREADSHEET_ACCESS_ERROR',
            hint: 'サービスアカウントに共有権限が付与されているか確認してください',
          },
        },
        { status: 500 }
      )
    }
    
    // シート名が存在するか確認
    const sheetExists = spreadsheetInfo.sheets.some(s => s.title === sheetName)
    if (!sheetExists) {
      return NextResponse.json(
        {
          success: false,
          message: `シート "${sheetName}" が見つかりません`,
          error: `Sheet "${sheetName}" not found`,
          details: {
            requestedSheet: sheetName,
            availableSheets: spreadsheetInfo.sheets.map(s => s.title),
            hint: '利用可能なシート名を確認してください',
          },
        },
        { status: 404 }
      )
    }
    
    // データを読み取り
    const data = await readSheet(sheetName)
    
    return NextResponse.json({
      success: true,
      message: 'データの読み取りに成功しました',
      data: {
        spreadsheetTitle: spreadsheetInfo.title,
        sheetName,
        rows: data.slice(0, 10), // 最初の10行のみ表示
        totalRows: data.length,
        headers: data[0] || [],
        availableSheets: spreadsheetInfo.sheets.map(s => s.title),
      },
    })
  } catch (error) {
    console.error('エラー:', error)
    
    // より詳細なエラー情報を返す
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    return NextResponse.json(
      {
        success: false,
        message: 'データの読み取りに失敗しました',
        error: errorMessage,
        details: {
          spreadsheetId: process.env.SPREADSHEET_ID,
          sheetName,
          errorType: error instanceof Error ? error.constructor.name : 'Unknown',
          stack: errorStack,
        },
      },
      { status: 500 }
    )
  }
}
