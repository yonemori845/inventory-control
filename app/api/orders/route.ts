import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { getOrders, createOrder } from '@/lib/google-sheets/orders'
import { getProductById } from '@/lib/google-sheets/products'

export async function GET(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    const orders = await getOrders()
    const filtered = orderId ? orders.filter(o => o.orderId === orderId) : orders

    return NextResponse.json({
      success: true,
      data: filtered,
    })
  } catch (error) {
    console.error('エラー:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const items = body.items as Array<{ productId: string; quantity: number }>

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'items は1件以上の商品配列が必要です' },
        { status: 400 }
      )
    }

    const orderItems: Array<{ productId: string; quantity: number; unitPrice: number }> = []

    for (const item of items) {
      const product = await getProductById(item.productId)
      if (!product) {
        return NextResponse.json(
          { error: `商品ID ${item.productId} が見つかりません` },
          { status: 404 }
        )
      }
      const quantity = Math.max(1, parseInt(String(item.quantity), 10) || 1)
      orderItems.push({ productId: item.productId, quantity, unitPrice: product.price })
    }

    const orderId = await createOrder(orderItems)

    return NextResponse.json({
      success: true,
      message: '注文が作成されました',
      data: { orderId },
    })
  } catch (error) {
    console.error('エラー:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
