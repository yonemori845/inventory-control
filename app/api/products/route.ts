import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { getProducts, createProduct } from '@/lib/google-sheets/products'
import type { Product } from '@/types'

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const products = await getProducts()
    
    return NextResponse.json({
      success: true,
      data: products,
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
    const product: Omit<Product, 'createdAt' | 'updatedAt'> = {
      productId: body.productId,
      name: body.name,
      barcode: body.barcode,
      price: parseFloat(body.price) || 0,
      category: body.category || '',
      imageUrl: body.imageUrl,
      size: body.size,
      productCode: body.productCode,
      priceExclTax: body.priceExclTax != null ? parseFloat(body.priceExclTax) : undefined,
    }
    
    await createProduct(product)
    
    return NextResponse.json({
      success: true,
      message: '商品が作成されました',
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
