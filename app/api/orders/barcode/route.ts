import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { getProductByBarcode } from '@/lib/google-sheets/products'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const barcode = searchParams.get('barcode')

    if (!barcode) {
      return NextResponse.json(
        { error: 'barcode パラメータが必要です' },
        { status: 400 }
      )
    }

    const product = await getProductByBarcode(barcode)

    if (!product) {
      return NextResponse.json(
        { success: false, error: '商品が見つかりません', data: null },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error) {
    console.error('エラー:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
