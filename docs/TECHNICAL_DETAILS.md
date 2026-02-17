# 技術詳細・実装ガイド

## 🛠️ 技術スタック詳細

### フロントエンド

#### 1. Next.js 14+ (App Router)
**選択理由:**
- サーバーコンポーネントによるパフォーマンス向上
- API Routesでバックエンドロジックを統合可能
- Vercelとの親和性が高い
- PWA対応が容易

**代替案:**
- **Remix**: 優れたデータローディング戦略
- **SvelteKit**: 軽量で高速
- **Vite + React**: よりシンプルな構成

#### 2. TypeScript
**必須理由:**
- 型安全性によるバグの早期発見
- Google Sheets APIのレスポンス型定義
- チーム開発時の可読性向上

#### 3. Tailwind CSS + shadcn/ui
**選択理由:**
- 迅速なUI開発
- カスタマイズが容易
- アクセシビリティ対応済みコンポーネント

**代替案:**
- **Material-UI (MUI)**: 豊富なコンポーネント
- **Chakra UI**: シンプルで使いやすい
- **Mantine**: 高機能なUIライブラリ

---

### 認証

#### NextAuth.js (Auth.js)
**選択理由:**
- Google OAuth統合が簡単
- セッション管理が自動化
- セキュリティベストプラクティス準拠

**実装例:**
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  // 権限管理のカスタマイズ
}
```

---

### データベース（Google Spreadsheet）

#### Google Sheets API
**選択理由:**
- 無料で利用可能
- スプレッドシートとして直接確認可能
- APIがシンプル

**実装アプローチ:**

1. **サービスアカウント方式（推奨）**
   - バックエンドからのみアクセス
   - セキュリティが高い
   - ユーザー認証不要

2. **OAuth 2.0方式**
   - ユーザーのスプレッドシートにアクセス
   - より柔軟だが複雑

**推奨ライブラリ:**
- `googleapis` (公式)
- `google-spreadsheet` (ラッパーライブラリ)

---

### バーコードスキャン

#### 推奨ライブラリ比較

| ライブラリ | メリット | デメリット |
|-----------|---------|-----------|
| **@zxing/library** | 軽量、多様なバーコード形式対応 | 実装がやや複雑 |
| **react-qr-reader** | シンプルなAPI | QRコード専用、メンテナンス少 |
| **html5-qrcode** | 使いやすい、ドキュメント充実 | やや重い |

**推奨: @zxing/library**
- バーコード（EAN-13, CODE-128等）とQRコードの両方に対応
- アクティブにメンテナンスされている

**実装例:**
```typescript
import { BrowserMultiFormatReader } from '@zxing/library'

const codeReader = new BrowserMultiFormatReader()
// カメラからバーコードを読み取り
```

---

### グラフ・可視化

#### 推奨ライブラリ比較

| ライブラリ | メリット | デメリット |
|-----------|---------|-----------|
| **Recharts** | React専用、使いやすい | カスタマイズに限界 |
| **Chart.js + react-chartjs-2** | 高機能、豊富なチャート | 設定が複雑 |
| **Victory** | 美しいデザイン | バンドルサイズが大きい |

**推奨: Recharts**
- Reactとの統合が自然
- TypeScript対応
- 学習コストが低い

---

### 状態管理

#### 推奨アプローチ

1. **Zustand（推奨）**
   - 軽量でシンプル
   - TypeScript対応
   - 学習コストが低い

2. **React Context + useReducer**
   - 追加依存なし
   - 小規模アプリに適している

3. **TanStack Query (React Query)**
   - サーバー状態管理に最適
   - キャッシュ・再取得が自動化

**推奨構成:**
- グローバル状態: Zustand
- サーバー状態: TanStack Query

---

### PWA

#### next-pwa
**選択理由:**
- Next.jsとの統合が簡単
- Service Worker自動生成
- 設定が最小限

**実装:**
```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
})
```

---

## 📊 Google Spreadsheet設計詳細

### シート構造

#### 1. 商品マスタ (products)
```
| A: productId | B: name | C: barcode | D: price | E: category | F: createdAt | G: updatedAt |
|--------------|---------|------------|----------|-------------|--------------|--------------|
| PROD001      | 商品A   | 1234567890 | 1000     | カテゴリ1   | 2026-01-24   | 2026-01-24   |
```

**設計ポイント:**
- productId: 自動生成（UUID推奨）
- barcode: ユニーク制約（重複チェック）
- price: 数値型
- インデックス: 行番号で管理

#### 2. 在庫 (inventory)
```
| A: productId | B: quantity | C: minStock | D: lastUpdated | E: updatedBy |
|--------------|-------------|-------------|----------------|--------------|
| PROD001      | 50          | 10          | 2026-01-24     | user@email   |
```

**設計ポイント:**
- productIdで商品マスタと結合
- quantity: 現在在庫数
- minStock: 在庫アラート閾値

#### 3. 受注 (orders)
```
| A: orderId | B: productId | C: quantity | D: unitPrice | E: total | F: status | G: orderDate | H: updatedAt |
|------------|--------------|-------------|--------------|----------|-----------|--------------|--------------|
| ORD001     | PROD001      | 2           | 1000         | 2000     | pending   | 2026-01-24   | 2026-01-24   |
```

**ステータス:**
- `pending`: 受注済み
- `processing`: 処理中
- `completed`: 完了
- `cancelled`: キャンセル

#### 4. 売上 (sales)
```
| A: saleId | B: orderId | C: productId | D: quantity | E: unitPrice | F: total | G: saleDate |
|-----------|------------|--------------|-------------|--------------|----------|-------------|
| SALE001   | ORD001     | PROD001      | 2           | 1000         | 2000     | 2026-01-24   |
```

**設計ポイント:**
- 受注が完了した時点で売上レコードを作成
- 集計クエリを効率化するため別シートに分離

#### 5. ユーザー権限 (users)
```
| A: userId | B: email | C: role | D: createdAt |
|-----------|----------|---------|--------------|
| USER001   | user@... | admin   | 2026-01-24   |
```

**権限:**
- `admin`: 全機能アクセス可能
- `user`: 閲覧・在庫更新のみ

---

## 🔧 実装パターン

### Google Sheets API連携パターン

#### 1. データ読み取り
```typescript
// lib/google-sheets/read.ts
import { google } from 'googleapis'

export async function readSheet(range: string) {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'path/to/service-account.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  
  const sheets = google.sheets({ version: 'v4', auth })
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: range,
  })
  
  return response.data.values
}
```

#### 2. データ書き込み
```typescript
// lib/google-sheets/write.ts
export async function appendRow(range: string, values: any[]) {
  const sheets = google.sheets({ version: 'v4', auth })
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [values] },
  })
}
```

#### 3. データ更新
```typescript
export async function updateRow(range: string, values: any[]) {
  const sheets = google.sheets({ version: 'v4', auth })
  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [values] },
  })
}
```

---

### バーコードスキャン実装パターン

```typescript
// components/barcode/BarcodeScanner.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/library'

export function BarcodeScanner({ onScan }: { onScan: (code: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const codeReader = useRef(new BrowserMultiFormatReader())

  const startScan = async () => {
    try {
      const result = await codeReader.current.decodeFromVideoDevice(
        undefined,
        videoRef.current!,
        (result) => {
          if (result) {
            onScan(result.getText())
            stopScan()
          }
        }
      )
    } catch (err) {
      console.error('スキャンエラー:', err)
    }
  }

  const stopScan = () => {
    codeReader.current.reset()
    setIsScanning(false)
  }

  return (
    <div>
      <video ref={videoRef} />
      <button onClick={startScan}>スキャン開始</button>
      <button onClick={stopScan}>停止</button>
    </div>
  )
}
```

---

## 🚨 注意点・制約事項

### Google Sheets API制限

1. **レート制限**
   - 1分あたり60リクエスト（デフォルト）
   - 1日あたり300リクエスト（無料枠）
   - 大量データ処理時はバッチ処理を検討

2. **パフォーマンス**
   - 大量データの読み書きは遅い
   - ページネーション実装が必須
   - キャッシュ戦略が重要

3. **同時更新**
   - 複数ユーザーが同時更新すると競合の可能性
   - 楽観的ロックまたはタイムスタンプチェックを実装

### バーコードスキャン制約

1. **ブラウザ互換性**
   - HTTPS必須（localhost除く）
   - モバイルブラウザで動作確認が必要

2. **カメラ権限**
   - ユーザーが明示的に許可する必要がある
   - 権限拒否時のエラーハンドリング必須

### PWA制約

1. **Service Worker**
   - HTTPS必須
   - 一部のブラウザで制限あり

2. **オフライン機能**
   - Spreadsheet APIはオフライン不可
   - ローカルストレージで一時保存を検討

---

## 📈 スケーラビリティ考慮

### 現在の設計の限界

- Google Spreadsheetは小〜中規模のデータに適している
- 10,000行を超える場合はパフォーマンス低下の可能性

### 将来的な移行先

1. **Firebase Firestore**
   - リアルタイム同期
   - スケーラブル
   - 無料枠あり

2. **Supabase**
   - PostgreSQLベース
   - オープンソース
   - リアルタイム機能

3. **PlanetScale**
   - MySQL互換
   - サーバーレス
   - 無料枠あり

---

## 🎯 次のアクション

1. **技術スタックの最終決定**
   - フレームワーク選択
   - UIライブラリ選択
   - バーコードライブラリ選択

2. **Google Cloud Console設定**
   - プロジェクト作成
   - API有効化
   - 認証情報取得

3. **プロジェクト初期化**
   - プロジェクト作成
   - 依存関係インストール
   - 基本構造構築

4. **スプレッドシート準備**
   - シート作成
   - 構造設計
   - テストデータ投入
