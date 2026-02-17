import { readSheetRows, appendRow } from './index'
import { getCol, getColInt, getColNum } from './column-map'
import type { Sale } from '@/types'

const SHEET_NAME = 'sales'

function mapRowToSale(row: Record<string, unknown>): Sale {
  return {
    saleId: getCol(row, '売上ID', 'saleId', 'ID'),
    orderId: getCol(row, '注文ID', 'orderId'),
    productId: getCol(row, '商品ID', 'productId'),
    quantity: getColInt(row, '数量', 'quantity'),
    unitPrice: getColNum(row, '単価', 'unitPrice'),
    total: getColNum(row, '合計', 'total'),
    saleDate: getCol(row, '売上日', 'saleDate'),
  }
}

export async function getSales(): Promise<Sale[]> {
  const rows = await readSheetRows(SHEET_NAME, 1)
  return rows.map(mapRowToSale)
}

export async function getSalesByDateRange(
  startDate: string,
  endDate: string
): Promise<Sale[]> {
  const sales = await getSales()
  return sales.filter((s) => {
    const d = s.saleDate
    return d >= startDate && d <= endDate
  })
}

export async function getNextSaleId(): Promise<string> {
  const sales = await getSales()
  const numericIds = sales
    .map((s) => parseInt(s.saleId, 10))
    .filter((n) => !isNaN(n))
  const max = numericIds.length > 0 ? Math.max(...numericIds) : 0
  return String(max + 1)
}

export async function createSale(
  orderId: string,
  productId: string,
  quantity: number,
  unitPrice: number,
  total: number
): Promise<void> {
  const saleId = await getNextSaleId()
  const saleDate = new Date().toISOString().split('T')[0]

  await appendRow(SHEET_NAME, [
    saleId,
    orderId,
    productId,
    quantity.toString(),
    unitPrice.toString(),
    total.toString(),
    saleDate,
  ])
}
