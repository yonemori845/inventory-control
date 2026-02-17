"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function InventoryEditPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.productId as string

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const [productName, setProductName] = useState("")
  const [quantity, setQuantity] = useState(0)
  const [minStock, setMinStock] = useState(0)
  const [inventoryExists, setInventoryExists] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const [productRes, inventoryRes] = await Promise.all([
          fetch(`/api/products/${productId}`),
          fetch(`/api/inventory/${productId}`),
        ])

        const productData = await productRes.json()
        const inventoryData = await inventoryRes.json()

        if (productData.success) {
          setProductName(productData.data.name)
        }
        if (inventoryData.success) {
          setQuantity(inventoryData.data.quantity)
          setMinStock(inventoryData.data.minStock)
          setInventoryExists(true)
        } else if (inventoryRes.status === 404) {
          setQuantity(0)
          setMinStock(0)
          setInventoryExists(false)
        }
      } catch {
        setError("データの取得に失敗しました")
      } finally {
        setFetching(false)
      }
    }
    fetchData()
  }, [productId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`/api/inventory/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity, minStock }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "更新に失敗しました")
      }

      router.push("/inventory")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateInventory = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity,
          minStock,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "在庫の登録に失敗しました")
      }

      router.push("/inventory")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <main className="flex min-h-screen flex-col p-8">
        <div className="container mx-auto max-w-md">
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col p-8">
      <div className="container mx-auto max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" size="sm" asChild>
            <Link href="/inventory">← 在庫一覧に戻る</Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h1 className="mb-2 text-xl font-bold">在庫数量の変更</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            {productName || `商品ID: ${productId}`}
          </p>

          <form
            onSubmit={inventoryExists ? handleSubmit : handleCreateInventory}
            className="space-y-4"
          >
            {error && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium">在庫数</label>
              <Input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                最小在庫（アラート閾値）
              </label>
              <Input
                type="number"
                min="0"
                value={minStock}
                onChange={(e) => setMinStock(parseInt(e.target.value, 10) || 0)}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "保存中..." : "保存する"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/inventory">キャンセル</Link>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
