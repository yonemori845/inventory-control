import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { getSales, getSalesByDateRange } from '@/lib/google-sheets/sales'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let sales
    if (startDate && endDate) {
      sales = await getSalesByDateRange(startDate, endDate)
    } else {
      sales = await getSales()
    }

    return NextResponse.json({
      success: true,
      data: sales,
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
