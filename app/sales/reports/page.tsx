import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import { getSales } from "@/lib/google-sheets/sales"
import { getProducts } from "@/lib/google-sheets/products"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SalesCharts } from "./SalesCharts"

export default async function SalesReportsPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const [sales, products] = await Promise.all([
    getSales(),
    getProducts(),
  ])

  const productNames = Object.fromEntries(
    products.map((p) => [p.productId, p.name])
  )

  return (
    <main className="flex min-h-screen flex-col p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">売上レポート</h1>
            <p className="mt-2 text-muted-foreground">
              売上推移と商品別分析
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/sales">← 売上一覧に戻る</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">ホームに戻る</Link>
            </Button>
          </div>
        </div>

        <SalesCharts sales={sales} productNames={productNames} />
      </div>
    </main>
  )
}
