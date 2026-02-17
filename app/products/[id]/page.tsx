import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import { getProductById } from "@/lib/google-sheets/products"
import { getInventoryByProductId } from "@/lib/google-sheets/inventory"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type Props = {
  params: { id: string }
}

export default async function ProductDetailPage({ params }: Props) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  const inventory = await getInventoryByProductId(params.id)

  return (
    <main className="flex min-h-screen flex-col p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" size="sm" asChild>
            <Link href="/products">← 商品一覧に戻る</Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row">
            {/* 商品画像 */}
            <div className="flex-shrink-0">
              {product.imageUrl ? (
                <div className="relative h-48 w-48 overflow-hidden rounded-lg border bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-48 w-48 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
                  画像なし
                </div>
              )}
            </div>

            {/* 商品情報 */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{product.name}</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  商品ID: {product.productId}
                </p>
              </div>

              <dl className="grid gap-2 text-sm">
                <div className="flex gap-2">
                  <dt className="w-24 font-medium text-muted-foreground">サイズ</dt>
                  <dd>{product.size || '-'}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-24 font-medium text-muted-foreground">商品コード</dt>
                  <dd>{product.productCode || '-'}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-24 font-medium text-muted-foreground">JANコード</dt>
                  <dd className="font-mono">{product.barcode}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-24 font-medium text-muted-foreground">税抜価格</dt>
                  <dd>
                    {product.priceExclTax
                      ? `¥${product.priceExclTax.toLocaleString()}`
                      : '-'}
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-24 font-medium text-muted-foreground">税込価格</dt>
                  <dd className="text-lg font-semibold">
                    ¥{product.price.toLocaleString()}
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-24 font-medium text-muted-foreground">在庫数</dt>
                  <dd>
                    {inventory ? (
                      <span
                        className={
                          inventory.minStock > 0 && inventory.quantity <= inventory.minStock
                            ? "font-semibold text-destructive"
                            : ""
                        }
                      >
                        {inventory.quantity} 個
                        {inventory.minStock > 0 && (
                          <span className="ml-2 text-muted-foreground">
                            （最小: {inventory.minStock}）
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">未登録</span>
                    )}
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-24 font-medium text-muted-foreground">作成日時</dt>
                  <dd>{product.createdAt || '-'}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-24 font-medium text-muted-foreground">更新日時</dt>
                  <dd>{product.updatedAt || '-'}</dd>
                </div>
              </dl>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" asChild>
                  <Link href="/products">商品一覧</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/inventory?productId=${product.productId}`}>
                    在庫を管理
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
