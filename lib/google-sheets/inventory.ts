import { readSheetRows, appendRow, updateRow, deleteRow } from './index'
import { getCol, getColInt } from './column-map'
import type { Inventory } from '@/types'

const SHEET_NAME = 'inventory'

export async function getInventory(): Promise<Inventory[]> {
  const rows = await readSheetRows(SHEET_NAME, 1) // ヘッダー行(index 0)をスキップ

  return rows.map((row) => {
    const r = row as Record<string, unknown>
    return {
      productId: getCol(r, '商品ID', 'productId', 'ID'),
      quantity: getColInt(r, '数量', 'quantity', '個数'),
      minStock: getColInt(r, '最小在庫', 'minStock'),
      lastUpdated: getCol(r, '最終更新日時', 'lastUpdated', '更新日時'),
      updatedBy: getCol(r, '更新者', 'updatedBy'),
    }
  })
}

export async function getInventoryByProductId(productId: string): Promise<Inventory | null> {
  const inventory = await getInventory()
  return inventory.find(i => i.productId === productId) || null
}

export async function createInventoryItem(
  inventory: Omit<Inventory, 'lastUpdated' | 'updatedBy'>,
  updatedBy: string
): Promise<void> {
  const now = new Date().toISOString().split('T')[0]
  
  await appendRow(SHEET_NAME, [
    inventory.productId,
    inventory.quantity.toString(),
    inventory.minStock.toString(),
    now,
    updatedBy,
  ])
}

export async function updateInventory(
  productId: string,
  updates: Partial<Inventory>,
  updatedBy: string
): Promise<void> {
  const inventory = await getInventory()
  const item = inventory.find(i => i.productId === productId)
  
  if (!item) {
    throw new Error(`Inventory item for product ${productId} not found`)
  }
  
  const updatedItem: Inventory = {
    ...item,
    ...updates,
    lastUpdated: new Date().toISOString().split('T')[0],
    updatedBy,
  }
  
  // 行番号を取得（ヘッダー行 + 1から始まる）
  const rowIndex = inventory.findIndex(i => i.productId === productId) + 2
  
  await updateRow(SHEET_NAME, rowIndex, [
    updatedItem.productId,
    updatedItem.quantity.toString(),
    updatedItem.minStock.toString(),
    updatedItem.lastUpdated,
    updatedItem.updatedBy,
  ])
}

export async function updateInventoryQuantity(
  productId: string,
  quantity: number,
  updatedBy: string
): Promise<void> {
  await updateInventory(productId, { quantity }, updatedBy)
}

export async function deleteInventoryItem(productId: string): Promise<void> {
  const inventory = await getInventory()
  const rowIndex = inventory.findIndex(i => i.productId === productId) + 2
  
  if (rowIndex < 2) {
    throw new Error(`Inventory item for product ${productId} not found`)
  }
  
  await deleteRow(SHEET_NAME, rowIndex)
}
