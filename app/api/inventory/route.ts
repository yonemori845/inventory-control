import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { getInventory, createInventoryItem } from '@/lib/google-sheets/inventory'
import type { Inventory } from '@/types'

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const inventory = await getInventory()
    
    return NextResponse.json({
      success: true,
      data: inventory,
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

export async function POST(request: Request) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const inventory: Omit<Inventory, 'lastUpdated' | 'updatedBy'> = {
      productId: body.productId,
      quantity: parseInt(body.quantity),
      minStock: parseInt(body.minStock) || 0,
    }
    
    const updatedBy = session.user?.email || 'unknown'
    await createInventoryItem(inventory, updatedBy)
    
    return NextResponse.json({
      success: true,
      message: '在庫が作成されました',
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
