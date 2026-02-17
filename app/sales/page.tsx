import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import { getSales } from "@/lib/google-sheets/sales"
import { getProducts } from "@/lib/google-sheets/products"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function SalesPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const [sales, products] = await Promise.all([
    getSales(),
    getProducts(),
  ])

  const productMap = new Map(products.map((p) => [p.productId, p]))
  const totalSales = sales.reduce((sum, s) => sum + s.total, 0)

  return (
    <main className="flex min-h-screen flex-col p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">売上管理</h1>
            <p className="mt-2 text-muted-foreground">
              売上データの一覧とレポート
            </p>
          </div>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/sales/reports">売上レポート</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">ホームに戻る</Link>
            </Button>
          </div>
        </div>

        <div className="mb-6 rounded-lg border bg-card p-4">
          <p className="text-2xl font-bold">
            合計売上: ¥{totalSales.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            {sales.length}件の売上レコード
          </p>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    売上ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    注文ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    商品名
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">
                    数量
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">
                    単価
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">
                    合計
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    売上日
                  </th>
                </tr>
              </thead>
              <tbody>
                {sales.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      売上データがありません。注文を完了すると売上として記録されます。
                    </td>
                  </tr>
                ) : (
                  [...sales]
                    .sort(
                      (a, b) =>
                        new Date(b.saleDate).getTime() -
                        new Date(a.saleDate).getTime()
                    )
                    .map((sale) => (
                      <tr
                        key={sale.saleId}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="px-4 py-3 text-sm">{sale.saleId}</td>
                        <td className="px-4 py-3 text-sm">{sale.orderId}</td>
                        <td className="px-4 py-3 text-sm font-medium">
                          {productMap.get(sale.productId)?.name || sale.productId}
                        </td>
                        <td className="px-4 py-3 text-right text-sm tabular-nums">
                          {sale.quantity}
                        </td>
                        <td className="px-4 py-3 text-right text-sm tabular-nums">
                          ¥{sale.unitPrice.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-semibold tabular-nums">
                          ¥{sale.total.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm">{sale.saleDate}</td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
