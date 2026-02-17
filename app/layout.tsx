import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "在庫注文管理システム",
  description: "Google Spreadsheetをデータベースとして使用する在庫・受注・売上管理システム",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
