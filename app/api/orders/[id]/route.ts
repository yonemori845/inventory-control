import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { updateOrderStatus } from '@/lib/google-sheets/orders'
import type { Order } from '@/types'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const status = body.status as Order['status']

    const validStatuses: Order['status'][] = ['pending', 'processing', 'completed', 'cancelled']
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: '有効なステータス（pending, processing, completed, cancelled）を指定してください' },
        { status: 400 }
      )
    }

    await updateOrderStatus(params.id, status)

    return NextResponse.json({
      success: true,
      message: 'ステータスが更新されました',
    })
  } catch (error) {
    console.error('エラー:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
