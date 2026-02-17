"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { BarcodeScanner } from "@/components/barcode/BarcodeScanner"

export function NewProductForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "",
    imageUrl: "",
    size: "",
    productCode: "",
    barcode: "",
    priceExclTax: "",
    price: "",
  })
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          imageUrl: form.imageUrl || undefined,
          size: form.size || undefined,
          productCode: form.productCode || undefined,
          barcode: form.barcode,
          priceExclTax: form.priceExclTax ? parseFloat(form.priceExclTax) : undefined,
          price: parseFloat(form.price) || 0,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "商品の登録に失敗しました")
      }

      router.push("/products")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium">
          商品名 <span className="text-destructive">*</span>
        </label>
        <Input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="例: リネンシャツ"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">画像URL</label>
        <Input
          type="url"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          placeholder="例: https://picsum.photos/200/200"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">サイズ</label>
        <Input
          value={form.size}
          onChange={(e) => setForm({ ...form, size: e.target.value })}
          placeholder="例: S, M, L"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">商品コード</label>
        <Input
          value={form.productCode}
          onChange={(e) => setForm({ ...form, productCode: e.target.value })}
          placeholder="例: MLS-101"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          JANコード（バーコード） <span className="text-destructive">*</span>
        </label>
        <div className="flex gap-2">
          <Input
            required
            value={form.barcode}
            onChange={(e) => setForm({ ...form, barcode: e.target.value })}
            placeholder="例: 4595643591894"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowBarcodeScanner(true)}
          >
            スキャン
          </Button>
        </div>
        {showBarcodeScanner && (
          <div className="mt-2">
            <BarcodeScanner
              onScan={(barcode) => {
                setForm((f) => ({ ...f, barcode }))
                setShowBarcodeScanner(false)
              }}
              onClose={() => setShowBarcodeScanner(false)}
            />
          </div>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">税抜価格</label>
        <Input
          type="number"
          min="0"
          step="1"
          value={form.priceExclTax}
          onChange={(e) => setForm({ ...form, priceExclTax: e.target.value })}
          placeholder="例: 3500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          税込価格 <span className="text-destructive">*</span>
        </label>
        <Input
          required
          type="number"
          min="0"
          step="1"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          placeholder="例: 3850"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "登録中..." : "登録する"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/products">キャンセル</Link>
        </Button>
      </div>
    </form>
  )
}
