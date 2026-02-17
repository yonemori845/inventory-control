import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import { getOrders } from "@/lib/google-sheets/orders"
import { getProducts } from "@/lib/google-sheets/products"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const STATUS_LABELS: Record<string, string> = {
  pending: '受注',
  processing: '処理中',
  completed: '完了',
  cancelled: 'キャンセル',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800',
}

export default async function OrdersPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const orders = await getOrders()
  const products = await getProducts()
  const productMap = new Map(products.map(p => [p.productId, p]))

  const grouped = orders.reduce<Record<string, typeof orders>>((acc, item) => {
    if (!acc[item.orderId]) acc[item.orderId] = []
    acc[item.orderId].push(item)
    return acc
  }, {})

  const orderIds = Object.keys(grouped).sort((a, b) => parseInt(b, 10) - parseInt(a, 10))

  return (
    <main className="flex min-h-screen flex-col p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">受注管理</h1>
            <p className="mt-2 text-muted-foreground">
              注文一覧とステータスを管理します
            </p>
          </div>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/orders/new">新規注文</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">ホームに戻る</Link>
            </Button>
          </div>
        </div>

        {orderIds.length === 0 ? (
          <div className="rounded-lg border bg-card p-12 text-center text-muted-foreground">
            注文がありません。新規注文を作成してください。
          </div>
        ) : (
          <div className="space-y-6">
            {orderIds.map((orderId) => {
              const items = grouped[orderId]
              const normalizedItems = items.map((item) => {
                if (item.total > 0 && (item.quantity === 0 || item.unitPrice === 0)) {
                  const product = productMap.get(item.productId)
                  if (product && product.price > 0) {
                    const quantity = Math.round(item.total / product.price)
                    return { ...item, quantity: quantity || 1, unitPrice: product.price }
                  }
                }
                return item
              })
              const total = normalizedItems.reduce((sum, i) => sum + i.total, 0)
              const status = items[0]?.status || 'pending'

              return (
                <div
                  key={orderId}
                  className="rounded-lg border bg-card p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <span className="font-semibold">注文ID: {orderId}</span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        {items[0]?.orderDate || ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${STATUS_COLORS[status] || ''}`}
                      >
                        {STATUS_LABELS[status] || status}
                      </span>
                      <span className="font-semibold">¥{total.toLocaleString()}</span>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/orders/${orderId}`}>詳細</Link>
                      </Button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left text-muted-foreground">
                          <th className="pb-2">商品名</th>
                          <th className="pb-2 text-right">数量</th>
                          <th className="pb-2 text-right">単価</th>
                          <th className="pb-2 text-right">小計</th>
                        </tr>
                      </thead>
                      <tbody>
                        {normalizedItems.map((item) => {
                          const product = productMap.get(item.productId)
                          return (
                            <tr key={`${item.orderId}-${item.productId}`} className="border-b">
                              <td className="py-2">{product?.name || item.productId}</td>
                              <td className="py-2 text-right">{item.quantity}</td>
                              <td className="py-2 text-right">¥{item.unitPrice.toLocaleString()}</td>
                              <td className="py-2 text-right">¥{item.total.toLocaleString()}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
