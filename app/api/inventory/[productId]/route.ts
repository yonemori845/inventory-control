import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import {
  getInventoryByProductId,
  updateInventory,
  updateInventoryQuantity,
  deleteInventoryItem,
} from '@/lib/google-sheets/inventory'

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const inventory = await getInventoryByProductId(params.productId)
    
    if (!inventory) {
      return NextResponse.json(
        { error: 'Inventory item not found' },
        { status: 404 }
      )
    }
    
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

export async function PUT(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const updatedBy = session.user?.email || 'unknown'
    
    // quantityのみの更新の場合
    if (body.quantity !== undefined && Object.keys(body).length === 1) {
      await updateInventoryQuantity(params.productId, parseInt(body.quantity), updatedBy)
    } else {
      await updateInventory(params.productId, body, updatedBy)
    }
    
    return NextResponse.json({
      success: true,
      message: '在庫が更新されました',
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

export async function DELETE(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    await deleteInventoryItem(params.productId)
    
    return NextResponse.json({
      success: true,
      message: '在庫が削除されました',
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
