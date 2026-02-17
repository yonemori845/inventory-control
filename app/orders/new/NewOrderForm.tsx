"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BarcodeScanner } from "@/components/barcode/BarcodeScanner"

type CartItem = {
  productId: string
  name: string
  quantity: number
  unitPrice: number
  total: number
}

export function NewOrderForm() {
  const router = useRouter()
  const [products, setProducts] = useState<Array<{ productId: string; name: string; price: number }>>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [productSelect, setProductSelect] = useState("")
  const [quantityInput, setQuantityInput] = useState("1")
  const [showScanner, setShowScanner] = useState(false)
  const [scanError, setScanError] = useState("")

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.data)
      })
      .catch(() => setError("商品の取得に失敗しました"))
  }, [])

  const addProductToCart = useCallback(
    (product: { productId: string; name: string; price: number }, quantity = 1) => {
      const qty = Math.max(1, quantity)
      setCart((prev) => {
        const existing = prev.find((c) => c.productId === product.productId)
        if (existing) {
          return prev.map((c) =>
            c.productId === product.productId
              ? { ...c, quantity: c.quantity + qty, total: (c.quantity + qty) * c.unitPrice }
              : c
          )
        }
        return [
          ...prev,
          {
            productId: product.productId,
            name: product.name,
            quantity: qty,
            unitPrice: product.price,
            total: qty * product.price,
          },
        ]
      })
    },
    []
  )

  const addToCart = () => {
    const product = products.find((p) => p.productId === productSelect)
    if (!product || !productSelect) return

    const quantity = Math.max(1, parseInt(quantityInput, 10) || 1)
    addProductToCart(product, quantity)
    setQuantityInput("1")
  }

  const handleBarcodeScan = useCallback(
    async (barcode: string) => {
      setScanError("")
      try {
        const res = await fetch(`/api/orders/barcode?barcode=${encodeURIComponent(barcode)}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || "商品が見つかりません")
        }

        if (data.success && data.data) {
          const product = data.data
          addProductToCart(
            { productId: product.productId, name: product.name, price: product.price },
            1
          )
          setShowScanner(false)
        } else {
          setScanError("該当する商品が見つかりませんでした")
        }
      } catch (err) {
        setScanError(err instanceof Error ? err.message : "スキャンに失敗しました")
      }
    },
    [addProductToCart]
  )

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((c) => c.productId !== productId))
  }

  const submitOrder = async () => {
    if (cart.length === 0) {
      setError("カートに商品を追加してください")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((c) => ({ productId: c.productId, quantity: c.quantity })),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "注文の作成に失敗しました")
      }

      router.push(`/orders/${data.data.orderId}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました")
    } finally {
      setLoading(false)
    }
  }

  const cartTotal = cart.reduce((sum, c) => sum + c.total, 0)

  return (
    <div className="space-y-6">
      {showScanner ? (
        <BarcodeScanner
          onScan={handleBarcodeScan}
          onClose={() => {
            setShowScanner(false)
            setScanError("")
          }}
        />
      ) : (
        <Button
          variant="outline"
          onClick={() => setShowScanner(true)}
          className="w-full"
        >
          バーコードスキャンで商品を追加
        </Button>
      )}
      {scanError && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {scanError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">商品を追加</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">商品</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={productSelect}
                onChange={(e) => setProductSelect(e.target.value)}
              >
                <option value="">選択してください</option>
                {products.map((p) => (
                  <option key={p.productId} value={p.productId}>
                    {p.name}（¥{p.price.toLocaleString()}）
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">数量</label>
              <Input
                type="number"
                min="1"
                value={quantityInput}
                onChange={(e) => setQuantityInput(e.target.value)}
              />
            </div>
            <Button onClick={addToCart} disabled={!productSelect} className="w-full">
              カートに追加
            </Button>
          </div>
        </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">注文カート</h2>

        {error && (
          <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {cart.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">カートは空です</p>
        ) : (
          <>
            <div className="space-y-2">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between rounded border p-3"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity}個 × ¥{item.unitPrice.toLocaleString()} = ¥
                      {item.total.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    削除
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t pt-4">
              <p className="text-right text-lg font-semibold">
                合計: ¥{cartTotal.toLocaleString()}
              </p>
            </div>
            <Button
              className="mt-4 w-full"
              onClick={submitOrder}
              disabled={loading}
            >
              {loading ? "登録中..." : "注文を確定する"}
            </Button>
          </>
        )}
      </div>
    </div>
    </div>
  )
}
