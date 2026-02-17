import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import { getOrdersByOrderId } from "@/lib/google-sheets/orders"
import { getProducts } from "@/lib/google-sheets/products"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { OrderStatusForm } from "./OrderStatusForm"

const STATUS_LABELS: Record<string, string> = {
  pending: '受注',
  processing: '処理中',
  completed: '完了',
  cancelled: 'キャンセル',
}

type Props = {
  params: { id: string }
}

export default async function OrderDetailPage({ params }: Props) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const items = await getOrdersByOrderId(params.id)

  if (!items.length) {
    notFound()
  }

  const products = await getProducts()
  const productMap = new Map(products.map(p => [p.productId, p]))

  // 数量・単価が0だが合計がある場合：商品マスタの価格から補正
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
    <main className="flex min-h-screen flex-col p-8">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" size="sm" asChild>
            <Link href="/orders">← 注文一覧に戻る</Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">注文ID: {params.id}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                注文日: {items[0]?.orderDate || '-'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="rounded bg-muted px-3 py-1 text-sm font-medium">
                {STATUS_LABELS[status] || status}
              </span>
              <span className="text-xl font-semibold">¥{total.toLocaleString()}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
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
                    <tr key={item.productId} className="border-b">
                      <td className="py-3">{product?.name || item.productId}</td>
                      <td className="py-3 text-right">{item.quantity}</td>
                      <td className="py-3 text-right">
                        ¥{item.unitPrice.toLocaleString()}
                      </td>
                      <td className="py-3 text-right font-medium">
                        ¥{item.total.toLocaleString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end border-t pt-6">
            <p className="text-lg font-semibold">合計: ¥{total.toLocaleString()}</p>
          </div>

          <div className="mt-8 border-t pt-6">
            <h2 className="mb-4 font-semibold">ステータスを変更</h2>
            <OrderStatusForm orderId={params.id} currentStatus={status} />
          </div>
        </div>
      </div>
    </main>
  )
}
