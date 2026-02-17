"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            在庫管理システム
          </h1>
          <p className="mt-2 text-muted-foreground">
            ログインしてシステムを利用してください
          </p>
        </div>
        <div className="space-y-4">
          <Button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full"
            size="lg"
          >
            Googleでログイン
          </Button>
        </div>
      </div>
    </div>
  )
}
