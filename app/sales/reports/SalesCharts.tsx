"use client"

import type { Sale } from "@/types"

type SalesChartsProps = {
  sales: Sale[]
  productNames: Record<string, string>
}

export function SalesCharts({ sales, productNames }: SalesChartsProps) {
  // 日付別売上集計
  const dailyData = sales.reduce<Record<string, number>>((acc, s) => {
    const date = s.saleDate
    acc[date] = (acc[date] || 0) + s.total
    return acc
  }, {})

  const dailyChartData = Object.entries(dailyData)
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => a.date.localeCompare(b.date))

  // 商品別売上集計
  const productData = sales.reduce<Record<string, number>>((acc, s) => {
    const name = productNames[s.productId] || s.productId
    acc[name] = (acc[name] || 0) + s.total
    return acc
  }, {})

  const productChartData = Object.entries(productData)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8)

  const totalSales = sales.reduce((sum, s) => sum + s.total, 0)
  const maxDaily =
    dailyChartData.length > 0
      ? Math.max(...dailyChartData.map((d) => d.total))
      : 1
  const maxProduct =
    productChartData.length > 0
      ? Math.max(...productChartData.map((d) => d.total))
      : 1

  if (sales.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center">
        <p className="text-muted-foreground">
          売上データがありません。注文を完了するとレポートが表示されます。
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">売上推移（日別）</h2>
        <div className="space-y-2">
          {dailyChartData.map(({ date, total }) => (
            <div key={date} className="flex items-center gap-4">
              <span className="w-24 text-sm">{date}</span>
              <div className="flex-1">
                <div
                  className="h-8 rounded bg-primary/80"
                  style={{ width: `${(total / maxDaily) * 100}%` }}
                />
              </div>
              <span className="w-24 text-right text-sm tabular-nums">
                ¥{total.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">商品別売上（上位8件）</h2>
          <div className="space-y-2">
            {productChartData.map(({ name, total }) => (
              <div key={name} className="flex items-center gap-4">
                <span className="w-32 truncate text-sm" title={name}>
                  {name}
                </span>
                <div className="flex-1">
                  <div
                    className="h-6 rounded bg-emerald-500/80"
                    style={{ width: `${(total / maxProduct) * 100}%` }}
                  />
                </div>
                <span className="w-24 text-right text-sm tabular-nums">
                  ¥{total.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">商品別売上構成比</h2>
          <div className="space-y-2">
            {productChartData.map(({ name, total }) => (
              <div key={name} className="flex items-center justify-between gap-4">
                <span className="truncate text-sm" title={name}>
                  {name}
                </span>
                <span className="text-sm tabular-nums">
                  ¥{total.toLocaleString()}{" "}
                  ({totalSales > 0 ? ((total / totalSales) * 100).toFixed(1) : 0}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
