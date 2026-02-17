import { NextResponse } from 'next/server'
import { readSheet } from '@/lib/google-sheets/read'
import { getSheetsClient } from '@/lib/google-sheets/client'

const EXPECTED_STRUCTURE: Record<string, Array<{ field: string; expectedHeaders: string[] }>> = {
  products: [
    { field: 'productId', expectedHeaders: ['商品ID', 'productId', 'ID'] },
    { field: 'name', expectedHeaders: ['商品名', 'name'] },
    { field: 'imageUrl', expectedHeaders: ['画像URL', 'imageUrl'] },
    { field: 'size', expectedHeaders: ['サイズ', 'size'] },
    { field: 'productCode', expectedHeaders: ['商品コード', 'productCode'] },
    { field: 'barcode', expectedHeaders: ['JANコード', 'barcode', 'JAN'] },
    { field: 'priceExclTax', expectedHeaders: ['税抜価格', 'priceExclTax'] },
    { field: 'price', expectedHeaders: ['税込価格', 'price'] },
    { field: 'createdAt', expectedHeaders: ['作成日時', 'createdAt'] },
    { field: 'updatedAt', expectedHeaders: ['更新日時', 'updatedAt'] },
  ],
  inventory: [
    { field: 'productId', expectedHeaders: ['商品ID', 'productId'] },
    { field: 'quantity', expectedHeaders: ['数量', 'quantity'] },
    { field: 'minStock', expectedHeaders: ['最小在庫', 'minStock'] },
    { field: 'lastUpdated', expectedHeaders: ['最終更新日時', 'lastUpdated'] },
    { field: 'updatedBy', expectedHeaders: ['更新者', 'updatedBy'] },
  ],
  orders: [
    { field: 'orderId', expectedHeaders: ['注文ID', 'orderId'] },
    { field: 'productId', expectedHeaders: ['商品ID', 'productId'] },
    { field: 'quantity', expectedHeaders: ['数量', 'quantity'] },
    { field: 'unitPrice', expectedHeaders: ['単価', 'unitPrice'] },
    { field: 'total', expectedHeaders: ['合計', 'total'] },
    { field: 'status', expectedHeaders: ['ステータス', 'status'] },
    { field: 'orderDate', expectedHeaders: ['注文日', 'orderDate'] },
    { field: 'updatedAt', expectedHeaders: ['更新日時', 'updatedAt'] },
  ],
  sales: [
    { field: 'saleId', expectedHeaders: ['売上ID', 'saleId'] },
    { field: 'orderId', expectedHeaders: ['注文ID', 'orderId'] },
    { field: 'productId', expectedHeaders: ['商品ID', 'productId'] },
    { field: 'quantity', expectedHeaders: ['数量', 'quantity'] },
    { field: 'unitPrice', expectedHeaders: ['単価', 'unitPrice'] },
    { field: 'total', expectedHeaders: ['合計', 'total'] },
    { field: 'saleDate', expectedHeaders: ['売上日', 'saleDate'] },
  ],
  users: [
    { field: 'userId', expectedHeaders: ['ユーザーID', 'userId'] },
    { field: 'email', expectedHeaders: ['メールアドレス', 'email'] },
    { field: 'role', expectedHeaders: ['権限', 'role'] },
    { field: 'createdAt', expectedHeaders: ['作成日時', 'createdAt'] },
  ],
}

export async function GET() {
  try {
    const sheets = await getSheetsClient()
    const spreadsheetId = process.env.SPREADSHEET_ID!
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId })
    const sheetNames: string[] =
      spreadsheet.data.sheets?.map(s => s.properties?.title ?? '').filter(Boolean) ?? []

    const results: Record<string, unknown> = {}

    for (const sheetName of sheetNames) {
      try {
        const data = await readSheet(sheetName)
        const headers: string[] = (data[0] || []).map((h: unknown) => String(h || '').trim())
        const expected = EXPECTED_STRUCTURE[sheetName]

        if (!expected) {
          results[sheetName] = { headers, expected: [], matched: {}, unmatched: [], note: 'このシートは未対応' }
          continue
        }

        const matched: Record<string, string> = {}
        const unmatched: string[] = []

        for (const { field, expectedHeaders } of expected) {
          const found = expectedHeaders.find(eh => headers.includes(eh))
          if (found) {
            matched[field] = found
          } else {
            unmatched.push(field)
          }
        }

        results[sheetName] = { headers, expected, matched, unmatched }
      } catch (err) {
        results[sheetName] = {
          headers: [],
          expected: EXPECTED_STRUCTURE[sheetName] || [],
          matched: {},
          unmatched: [],
          error: err instanceof Error ? err.message : 'Unknown error',
        }
      }
    }

    return NextResponse.json({
      success: true,
      spreadsheetTitle: spreadsheet.data.properties?.title,
      sheetNames,
      results,
      hint: 'headers に実際のヘッダーが表示されます。expected の expectedHeaders のいずれかと一致する必要があります。',
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
