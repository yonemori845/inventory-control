/**
 * 行オブジェクトから、複数の候補列名を試して値を取得する
 * スプレッドシートの列名変更に対応するため
 */
export function getCol(row: Record<string, unknown>, ...names: string[]): string {
  for (const name of names) {
    const val = row[name]
    if (val !== undefined && val !== null && val !== '') {
      return String(val).trim()
    }
  }
  return ''
}

/**
 * 数値として取得（空の場合は0）
 */
export function getColNum(row: Record<string, unknown>, ...names: string[]): number {
  const s = getCol(row, ...names)
  const n = parseFloat(s)
  return !isNaN(n) ? n : 0
}

/**
 * 整数として取得
 */
export function getColInt(row: Record<string, unknown>, ...names: string[]): number {
  const s = getCol(row, ...names)
  const n = parseInt(s, 10)
  return !isNaN(n) ? n : 0
}
