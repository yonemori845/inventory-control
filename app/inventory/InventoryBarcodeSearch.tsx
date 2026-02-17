"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BarcodeScanner } from "@/components/barcode/BarcodeScanner"

export function InventoryBarcodeSearch() {
  const router = useRouter()
  const [showScanner, setShowScanner] = useState(false)
  const [error, setError] = useState("")

  const handleScan = async (barcode: string) => {
    setError("")
    try {
      const res = await fetch(
        `/api/orders/barcode?barcode=${encodeURIComponent(barcode)}`
      )
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "商品が見つかりません")
      }

      if (data.success && data.data?.productId) {
        setShowScanner(false)
        router.push(`/inventory/${data.data.productId}`)
      } else {
        setError("該当する商品が見つかりませんでした")
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "スキャンに失敗しました"
      )
    }
  }

  if (showScanner) {
    return (
      <div className="space-y-2">
        <BarcodeScanner
          onScan={handleScan}
          onClose={() => {
            setShowScanner(false)
            setError("")
          }}
        />
        {error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-2 text-sm text-destructive">
            {error}
          </div>
        )}
      </div>
    )
  }

  return (
    <Button variant="outline" onClick={() => setShowScanner(true)}>
      バーコードで在庫を検索
    </Button>
  )
}
