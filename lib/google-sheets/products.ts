import { readSheetRows, appendRow, updateRow, deleteRow } from './index'
import { getCol, getColNum } from './column-map'
import type { Product } from '@/types'

const SHEET_NAME = 'products'

export async function getProducts(): Promise<Product[]> {
  const rows = await readSheetRows(SHEET_NAME, 1) // ヘッダー行(index 0)をスキップし、1行目(index 1)から読み込み

  return rows.map((row) => {
    const r = row as Record<string, unknown>
    return {
      productId: getCol(r, '商品ID', 'productId', 'ID'),
      name: getCol(r, '商品名', 'name'),
      imageUrl: getCol(r, '画像URL', 'imageUrl'),
      size: getCol(r, 'サイズ', 'size'),
      productCode: getCol(r, '商品コード', 'productCode'),
      barcode: getCol(r, 'JANコード', 'barcode', 'JAN'),
      priceExclTax: getColNum(r, '税抜価格', 'priceExclTax'),
      price: getColNum(r, '税込価格', 'price'),
      category: getCol(r, 'カテゴリ', 'category'),
      createdAt: getCol(r, '作成日時', 'createdAt'),
      updatedAt: getCol(r, '更新日時', 'updatedAt'),
    }
  })
}

export async function getProductById(productId: string): Promise<Product | null> {
  const products = await getProducts()
  return products.find(p => p.productId === productId) || null
}

export async function getProductByBarcode(barcode: string): Promise<Product | null> {
  const products = await getProducts()
  return products.find(p => p.barcode === barcode) || null
}

/** 次の商品IDを採番（既存の最大ID + 1） */
export async function getNextProductId(): Promise<string> {
  const products = await getProducts()
  const numericIds = products
    .map(p => parseInt(p.productId, 10))
    .filter(n => !isNaN(n))
  const max = numericIds.length > 0 ? Math.max(...numericIds) : 0
  return String(max + 1)
}

export async function createProduct(product: Omit<Product, 'createdAt' | 'updatedAt'>): Promise<void> {
  const productId = product.productId || (await getNextProductId())
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19) // YYYY-MM-DD HH:MM:SS形式

  const values = [
    productId,
    product.name,
    product.imageUrl || '',
    product.size || '',
    product.productCode || '',
    product.barcode,
    (product.priceExclTax ?? 0).toString(),
    product.price.toString(),
    now,
    now,
  ]

  await appendRow(SHEET_NAME, values)
}

export async function updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
  const products = await getProducts()
  const product = products.find(p => p.productId === productId)
  
  if (!product) {
    throw new Error(`Product with ID ${productId} not found`)
  }
  
  const updatedProduct: Product = {
    ...product,
    ...updates,
    updatedAt: new Date().toISOString().split('T')[0],
  }
  
  // 行番号を取得（ヘッダー行 + 1から始まる）
  const rowIndex = products.findIndex(p => p.productId === productId) + 2
  
  await updateRow(SHEET_NAME, rowIndex, [
    updatedProduct.productId,
    updatedProduct.name,
    updatedProduct.imageUrl || '',
    updatedProduct.size || '',
    updatedProduct.productCode || '',
    updatedProduct.barcode,
    (updatedProduct.priceExclTax ?? 0).toString(),
    updatedProduct.price.toString(),
    updatedProduct.createdAt,
    updatedProduct.updatedAt,
  ])
}

export async function deleteProductById(productId: string): Promise<void> {
  const products = await getProducts()
  const rowIndex = products.findIndex(p => p.productId === productId) + 2
  
  if (rowIndex < 2) {
    throw new Error(`Product with ID ${productId} not found`)
  }
  
  await deleteRow(SHEET_NAME, rowIndex)
}
