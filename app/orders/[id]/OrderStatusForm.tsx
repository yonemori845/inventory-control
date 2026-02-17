"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import type { Order } from "@/types"

type Props = {
  orderId: string
  currentStatus: Order["status"]
}

const STATUS_OPTIONS: { value: Order["status"]; label: string }[] = [
  { value: "pending", label: "受注" },
  { value: "processing", label: "処理中" },
  { value: "completed", label: "完了" },
  { value: "cancelled", label: "キャンセル" },
]

export function OrderStatusForm({ orderId, currentStatus }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [status, setStatus] = useState(currentStatus)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === currentStatus) return

    setLoading(true)
    setError("")

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "更新に失敗しました")
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
      {error && (
        <div className="w-full rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <div>
        <label className="mb-2 block text-sm font-medium">ステータス</label>
        <select
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value as Order["status"])}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" disabled={loading || status === currentStatus}>
        {loading ? "更新中..." : "更新する"}
      </Button>
    </form>
  )
}
