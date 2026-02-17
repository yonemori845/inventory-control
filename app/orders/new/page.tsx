import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { NewOrderForm } from "./NewOrderForm"

export default async function NewOrderPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <main className="flex min-h-screen flex-col p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" size="sm" asChild>
            <Link href="/orders">← 注文一覧に戻る</Link>
          </Button>
        </div>

        <h1 className="mb-6 text-2xl font-bold">新規注文</h1>
        <NewOrderForm />
      </div>
    </main>
  )
}
