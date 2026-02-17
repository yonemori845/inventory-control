import { readSheetRows, appendRow, updateRow } from './index'
import { getCol, getColInt, getColNum } from './column-map'
import type { Order } from '@/types'
import { createSale } from './sales'

const SHEET_NAME = 'orders'

function mapRowToOrder(row: Record<string, unknown>): Order {
  const statusVal = getCol(row, 'ステータス', 'status') || 'pending'
  // "23100 processing" のような混入時に、末尾の英単語部分を抽出
  const statusMatch = statusVal.match(/(pending|processing|completed|cancelled)/i)
  const statusStr = statusMatch ? statusMatch[1].toLowerCase() : statusVal
  const validStatus = ['pending', 'processing', 'completed', 'cancelled'].includes(statusStr)
    ? (statusStr as Order['status'])
    : 'pending'

  return {
    orderId: getCol(row, '注文ID', 'orderId', 'ID'),
    productId: getCol(row, '商品ID', 'productId', 'ID'),
    quantity: getColInt(row, '数量', 'quantity', '個数'),
    unitPrice: getColNum(row, '単価', 'unitPrice', '価格'),
    total: getColNum(row, '合計', 'total'),
    status: validStatus,
    orderDate: getCol(row, '注文日', 'orderDate'),
    updatedAt: getCol(row, '更新日時', 'updatedAt'),
  }
}

export async function getOrders(): Promise<Order[]> {
  const rows = await readSheetRows(SHEET_NAME, 1)
  return rows.map(mapRowToOrder)
}

export async function getOrdersByOrderId(orderId: string): Promise<Order[]> {
  const orders = await getOrders()
  return orders.filter(o => o.orderId === orderId)
}

export async function getNextOrderId(): Promise<string> {
  const orders = await getOrders()
  const orderIds = [...new Set(orders.map(o => String(o.orderId).trim()))]
  const numericIds = orderIds
    .map(id => parseInt(id, 10))
    .filter(n => !isNaN(n) && n > 0)
  const max = numericIds.length > 0 ? Math.max(...numericIds) : 0
  return String(max + 1)
}

export async function createOrderItem(
  orderId: string,
  productId: string,
  quantity: number,
  unitPrice: number,
  status: Order['status'] = 'pending'
): Promise<void> {
  const now = new Date().toISOString().split('T')[0]
  const total = quantity * unitPrice

  await appendRow(SHEET_NAME, [
    orderId,
    productId,
    quantity.toString(),
    unitPrice.toString(),
    total.toString(),
    status,
    now,
    now,
  ])
}

export async function createOrder(items: Array<{ productId: string; quantity: number; unitPrice: number }>) {
  const orderId = await getNextOrderId()
  const status: Order['status'] = 'pending'

  for (const item of items) {
    await createOrderItem(orderId, item.productId, item.quantity, item.unitPrice, status)
  }

  return orderId
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  const orders = await getOrders()
  const now = new Date().toISOString().split('T')[0]
  const orderItems = orders.filter((o) => o.orderId === orderId)
  const wasCompleted = orderItems.some((o) => o.status === 'completed')

  for (let i = 0; i < orders.length; i++) {
    const item = orders[i]
    if (item.orderId === orderId) {
      await updateRow(SHEET_NAME, i + 2, [
        item.orderId,
        item.productId,
        item.quantity.toString(),
        item.unitPrice.toString(),
        item.total.toString(),
        status,
        item.orderDate,
        now,
      ])
    }
  }

  // ステータスが完了に変わった場合のみ、売上レコードを作成（重複防止）
  if (status === 'completed' && !wasCompleted) {
    for (const item of orderItems) {
      await createSale(
        item.orderId,
        item.productId,
        item.quantity,
        item.unitPrice,
        item.total
      )
    }
  }
}
