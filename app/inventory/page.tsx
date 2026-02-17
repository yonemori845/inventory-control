import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import { getInventory } from "@/lib/google-sheets/inventory"
import { getProducts } from "@/lib/google-sheets/products"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { InventoryBarcodeSearch } from "./InventoryBarcodeSearch"

export default async function InventoryPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const [inventory, products] = await Promise.all([
    getInventory(),
    getProducts(),
  ])

  const productMap = new Map(products.map(p => [p.productId, p]))

  return (
    <main className="flex min-h-screen flex-col p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">在庫管理</h1>
            <p className="mt-2 text-muted-foreground">
              商品の在庫数量を管理します
            </p>
          </div>
          <div className="flex gap-4">
            <InventoryBarcodeSearch />
            <Button variant="outline" asChild>
              <Link href="/">ホームに戻る</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-semibold">商品ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">商品名</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">サイズ</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">在庫数</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">最小在庫</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">最終更新</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">操作</th>
                </tr>
              </thead>
              <tbody>
                {inventory.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      在庫データがありません。商品を登録後、在庫を追加してください。
                    </td>
                  </tr>
                ) : (
                  inventory.map((item) => {
                    const product = productMap.get(item.productId)
                    const isLowStock =
                      item.minStock > 0 && item.quantity <= item.minStock
                    return (
                      <tr
                        key={item.productId}
                        className={`border-b hover:bg-muted/50 ${
                          isLowStock ? "bg-destructive/5" : ""
                        }`}
                      >
                        <td className="px-4 py-3 text-sm">{item.productId}</td>
                        <td className="px-4 py-3 text-sm font-medium">
                          {product?.name || item.productId}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {product?.size || '-'}
                        </td>
                        <td
                          className={`px-4 py-3 text-right text-sm font-semibold ${
                            isLowStock ? "text-destructive" : ""
                          }`}
                        >
                          {item.quantity} 個
                        </td>
                        <td className="px-4 py-3 text-right text-sm">
                          {item.minStock}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {item.lastUpdated || '-'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/inventory/${item.productId}`}>
                                数量を変更
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/products/${item.productId}`}>
                                商品詳細
                              </Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            合計: {inventory.length}件の在庫
          </p>
          <Button variant="outline" asChild>
            <Link href="/products">商品一覧を見る</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
