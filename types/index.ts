// 基本的な型定義
export type UserRole = 'admin' | 'user'

// 商品マスタ
export interface Product {
  productId: string // 商品ID
  name: string // 商品名
  imageUrl?: string // 画像URL（オプション）
  size?: string // サイズ（オプション）
  productCode?: string // 商品コード（オプション）
  barcode: string // JANコード
  priceExclTax?: number // 税抜価格（オプション）
  price: number // 税込価格（メインの価格）
  category?: string // カテゴリ（オプション）
  createdAt: string // 作成日時
  updatedAt: string // 更新日時
}

// 在庫
export interface Inventory {
  productId: string
  quantity: number
  minStock: number
  lastUpdated: string
  updatedBy: string
}

// 注文
export interface Order {
  orderId: string
  productId: string
  quantity: number
  unitPrice: number
  total: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  orderDate: string
  updatedAt: string
}

// 売上
export interface Sale {
  saleId: string
  orderId: string
  productId: string
  quantity: number
  unitPrice: number
  total: number
  saleDate: string
}

// ユーザー
export interface User {
  userId: string
  email: string
  role: UserRole
  createdAt: string
}
