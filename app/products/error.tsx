"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Products page error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-xl font-semibold">商品ページの読み込みに失敗しました</h2>
      <p className="max-w-md text-center text-muted-foreground">
        {error.message}
      </p>
      <div className="flex gap-4">
        <Button onClick={reset}>再試行</Button>
        <Button variant="outline" asChild>
          <Link href="/">ホームに戻る</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/products">商品一覧を開く</Link>
        </Button>
      </div>
    </div>
  )
}
