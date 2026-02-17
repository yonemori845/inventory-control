import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { NewProductForm } from "./NewProductForm"

export default async function NewProductPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <main className="flex min-h-screen flex-col p-8">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" size="sm" asChild>
            <Link href="/products">← 商品一覧に戻る</Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h1 className="mb-6 text-2xl font-bold">新規商品登録</h1>
          <NewProductForm />
        </div>
      </div>
    </main>
  )
}
