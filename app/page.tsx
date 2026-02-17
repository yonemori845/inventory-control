import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function Home() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <main className="flex min-h-screen flex-col p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">在庫注文管理システム</h1>
            <p className="mt-2 text-muted-foreground">
              ようこそ、{session.user?.name || session.user?.email}さん
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link href="/api/auth/signout">ログアウト</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold">商品マスタ</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              商品一覧を表示・管理します
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/products">商品一覧を見る</Link>
            </Button>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold">在庫管理</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              商品の在庫数量を管理します
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/inventory">在庫一覧を見る</Link>
            </Button>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold">受注管理</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              注文情報を管理します
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/orders">注文一覧を見る</Link>
            </Button>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold">売上管理</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              売上データを確認・分析します
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/sales">売上一覧を見る</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
