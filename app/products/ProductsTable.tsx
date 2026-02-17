"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Product } from "@/types"

type SortKey = "productId" | "name" | "size" | "productCode" | "barcode" | "priceExclTax" | "price"
type SortOrder = "asc" | "desc"

const SORT_LABELS: Record<SortKey, string> = {
  productId: "商品ID",
  name: "商品名",
  size: "サイズ",
  productCode: "商品コード",
  barcode: "JANコード",
  priceExclTax: "税抜価格",
  price: "税込価格",
}

function SortIcon({ order }: { order: SortOrder | null }) {
  if (!order) return <span className="ml-1 text-muted-foreground opacity-50">↕</span>
  return <span className="ml-1">{order === "asc" ? "↑" : "↓"}</span>
}

export function ProductsTable({ products }: { products: Product[] }) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("asc")
    }
  }

  const sortedProducts = useMemo(() => {
    if (!sortKey) return products

    return [...products].sort((a, b) => {
      let aVal: string | number = a[sortKey] ?? ""
      let bVal: string | number = b[sortKey] ?? ""

      // 数値としてソート（商品ID、価格）
      if (
        sortKey === "productId" ||
        sortKey === "priceExclTax" ||
        sortKey === "price"
      ) {
        const aNum =
          sortKey === "productId"
            ? parseInt(String(aVal), 10) || 0
            : (typeof aVal === "number" ? aVal : parseFloat(String(aVal)) || 0)
        const bNum =
          sortKey === "productId"
            ? parseInt(String(bVal), 10) || 0
            : (typeof bVal === "number" ? bVal : parseFloat(String(bVal)) || 0)
        return sortOrder === "asc" ? aNum - bNum : bNum - aNum
      }

      // 文字列としてソート
      aVal = String(aVal)
      bVal = String(bVal)
      const cmp = aVal.localeCompare(bVal, "ja")
      return sortOrder === "asc" ? cmp : -cmp
    })
  }, [products, sortKey, sortOrder])

  const SortableHeader = ({
    sortKey: key,
    label,
    align = "left",
  }: {
    sortKey: SortKey
    label: string
    align?: "left" | "center" | "right"
  }) => (
    <th
      className={`px-4 py-3 text-sm font-semibold ${
        align === "right"
          ? "text-right"
          : align === "center"
            ? "text-center"
            : "text-left"
      }`}
    >
      <button
        type="button"
        onClick={() => handleSort(key)}
        className="inline-flex items-center hover:text-foreground"
      >
        {label}
        <SortIcon order={sortKey === key ? sortOrder : null} />
      </button>
    </th>
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <SortableHeader sortKey="productId" label={SORT_LABELS.productId} />
            <th className="px-4 py-3 text-center text-sm font-semibold w-16">
              画像
            </th>
            <SortableHeader sortKey="name" label={SORT_LABELS.name} />
            <SortableHeader
              sortKey="size"
              label={SORT_LABELS.size}
              align="center"
            />
            <SortableHeader
              sortKey="productCode"
              label={SORT_LABELS.productCode}
            />
            <SortableHeader sortKey="barcode" label={SORT_LABELS.barcode} />
            <th className="px-4 py-3 text-right text-sm font-semibold">
              <button
                type="button"
                onClick={() => handleSort("priceExclTax")}
                className="inline-flex items-center hover:text-foreground"
              >
                {SORT_LABELS.priceExclTax}
                <SortIcon
                  order={sortKey === "priceExclTax" ? sortOrder : null}
                />
              </button>
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold">
              <button
                type="button"
                onClick={() => handleSort("price")}
                className="inline-flex items-center hover:text-foreground"
              >
                {SORT_LABELS.price}
                <SortIcon order={sortKey === "price" ? sortOrder : null} />
              </button>
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold">
              操作
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.length === 0 ? (
            <tr>
              <td
                colSpan={9}
                className="px-4 py-8 text-center text-muted-foreground"
              >
                商品が登録されていません
              </td>
            </tr>
          ) : (
            sortedProducts.map((product) => (
              <tr
                key={product.productId}
                className="border-b hover:bg-muted/50 align-top"
              >
                <td className="px-4 py-3 text-sm">{product.productId}</td>
                <td className="px-4 py-2 text-center">
                  {product.imageUrl ? (
                    <div className="relative mx-auto h-10 w-10 overflow-hidden rounded border bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded border bg-muted text-xs text-muted-foreground">
                      -
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm font-medium">{product.name}</td>
                <td className="px-4 py-3 text-center text-sm">
                  {product.size || "-"}
                </td>
                <td className="px-4 py-3 text-sm">{product.productCode || "-"}</td>
                <td className="px-4 py-3 text-sm font-mono text-xs">
                  {product.barcode}
                </td>
                <td className="px-4 py-3 text-right text-sm tabular-nums">
                  {product.priceExclTax
                    ? `¥${product.priceExclTax.toLocaleString()}`
                    : "-"}
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold tabular-nums">
                  ¥{product.price.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/products/${product.productId}`}>
                        詳細
                      </Link>
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
