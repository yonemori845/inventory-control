import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import { getProducts } from "@/lib/google-sheets/products"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ProductsTable } from "./ProductsTable"

export default async function ProductsPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const products = await getProducts()

  return (
    <main className="flex min-h-screen flex-col p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">商品マスタ</h1>
            <p className="mt-2 text-muted-foreground">
              商品一覧を表示しています
            </p>
          </div>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/products/new">新規商品追加</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">ホームに戻る</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <ProductsTable products={products} />
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          合計: {products.length}件の商品
        </div>
      </div>
    </main>
  )
}
