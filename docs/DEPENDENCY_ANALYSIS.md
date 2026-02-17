# 依存関係・構築環境分析

## 🔍 技術スタックの依存関係検証

### 推奨バージョン（2026年1月時点）

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.4.0",
    "@types/node": "^20.11.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "next-auth": "^5.0.0-beta.4",
    "@auth/core": "^0.37.0",
    "googleapis": "^129.0.0",
    "google-spreadsheet": "^4.1.0",
    "@zxing/library": "^0.20.0",
    "recharts": "^2.12.0",
    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.28.0",
    "next-pwa": "^5.6.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "class-variance-authority": "^0.7.0",
    "lucide-react": "^0.344.0",
    "@radix-ui/react-slot": "^1.0.2"
  },
  "devDependencies": {
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "prettier": "^3.2.0"
  }
}
```

---

## ⚠️ 重要な依存関係の互換性チェック

### 1. Next.js 14 + NextAuth.js v5 (Beta)

**潜在的な問題:**
- NextAuth.js v5はベータ版のため、APIが変更される可能性
- Next.js 14のApp Routerとの統合で注意が必要

**検証済みの組み合わせ:**
- ✅ Next.js 14.2.0 + NextAuth.js 5.0.0-beta.4
- ✅ Next.js 14.1.0 + NextAuth.js 5.0.0-beta.3

**既知の問題:**
- NextAuth.js v5では`[...nextauth]`のルーティングが変更
- セッション管理のAPIが変更されている

**解決策:**
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
})

export { handler as GET, handler as POST }
```

**代替案（安定性重視）:**
- NextAuth.js v4を使用（ただし、App Router対応が限定的）
- または、Clerk、Auth0などの代替認証サービスを検討

---

### 2. next-pwa + Next.js 14

**潜在的な問題:**
- next-pwaはNext.js 13/14のApp Routerで一部制限あり
- Service Workerの生成タイミングに注意が必要

**検証済みの組み合わせ:**
- ✅ Next.js 14.2.0 + next-pwa 5.6.0
- ⚠️ Next.js 14.0.0 + next-pwa 5.5.0（一部問題あり）

**既知の問題:**
- 開発環境でService Workerが正しく動作しない場合がある
- ビルド時にエラーが発生する可能性

**解決策:**
```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // 開発環境では無効化
  buildExcludes: [/app-build-manifest\.json$/],
})
```

**代替案:**
- Workboxを直接使用
- または、PWA機能を後回しにして、まず基本機能を実装

---

### 3. @zxing/library + Next.js (SSR)

**潜在的な問題:**
- @zxing/libraryはブラウザ専用APIを使用
- SSR時にエラーが発生する可能性

**検証済みの組み合わせ:**
- ✅ Next.js 14 + @zxing/library 0.20.0（動的インポート使用時）

**既知の問題:**
- `window`や`navigator`が未定義のエラー
- カメラAPIがサーバー側で実行されようとする

**解決策:**
```typescript
// components/barcode/BarcodeScanner.tsx
'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// 動的インポートでSSRを回避
const BarcodeReader = dynamic(
  () => import('@zxing/library').then(mod => mod.BrowserMultiFormatReader),
  { ssr: false }
)
```

---

### 4. googleapis + TypeScript

**潜在的な問題:**
- googleapisの型定義が複雑
- 認証方法によって型が異なる

**検証済みの組み合わせ:**
- ✅ googleapis 129.0.0 + TypeScript 5.4.0

**既知の問題:**
- サービスアカウント認証時の型推論が弱い
- エラーハンドリングが複雑

**解決策:**
```typescript
// lib/google-sheets/client.ts
import { google } from 'googleapis'
import type { sheets_v4 } from 'googleapis'

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

export const sheets = google.sheets({
  version: 'v4',
  auth,
}) as sheets_v4.Sheets
```

---

### 5. Recharts + Next.js 14 (App Router)

**潜在的な問題:**
- Rechartsはクライアントコンポーネント必須
- SSR時のハイドレーションエラー

**検証済みの組み合わせ:**
- ✅ Next.js 14 + Recharts 2.12.0

**既知の問題:**
- サーバーコンポーネントで直接使用できない
- 動的インポートが必要

**解決策:**
```typescript
// components/charts/SalesChart.tsx
'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

export function SalesChart({ data }: { data: any[] }) {
  return (
    <LineChart width={600} height={300} data={data}>
      {/* ... */}
    </LineChart>
  )
}
```

---

### 6. Zustand + TanStack Query

**潜在的な問題:**
- 両方とも状態管理ライブラリだが、用途が異なる
- 併用時のベストプラクティスが必要

**検証済みの組み合わせ:**
- ✅ Zustand 4.5.0 + TanStack Query 5.28.0

**推奨パターン:**
- Zustand: UI状態（モーダル開閉、フォーム状態など）
- TanStack Query: サーバー状態（APIデータ、キャッシュ）

**解決策:**
```typescript
// store/ui-store.ts (Zustand)
import { create } from 'zustand'

interface UIState {
  isModalOpen: boolean
  openModal: () => void
  closeModal: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}))

// hooks/use-products.ts (TanStack Query)
import { useQuery } from '@tanstack/react-query'

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('/api/products')
      return res.json()
    },
  })
}
```

---

### 7. shadcn/ui + Next.js 14

**潜在的な問題:**
- shadcn/uiはコンポーネントライブラリではなく、コピー&ペースト型のUIコンポーネント集
- 各コンポーネントを個別にインストールする必要がある

**検証済みの組み合わせ:**
- ✅ Next.js 14 + Tailwind CSS 3.4 + shadcn/ui

**必要な依存関係:**
- `clsx`: クラス名の結合
- `tailwind-merge`: Tailwindクラスのマージ
- `class-variance-authority`: バリアント管理
- `lucide-react`: アイコンライブラリ
- `@radix-ui/*`: アクセシビリティ対応コンポーネント（必要に応じて）

**既知の問題:**
- コンポーネントを手動でコピーする必要がある
- バージョン管理が各コンポーネントごと

**解決策:**
```bash
# shadcn/uiの依存関係をインストール
npm install clsx tailwind-merge class-variance-authority lucide-react
npm install @radix-ui/react-slot

# 各コンポーネントは手動でインストール
# components/ui/button.tsx などを作成
```

**推奨アプローチ:**
- 必要なコンポーネントのみをインストール
- `components.json`で設定を管理（shadcn/ui CLI使用時）

---

## 🛠️ 構築環境の依存関係

### Node.js バージョン

**推奨:**
- Node.js 20.x LTS（推奨）
- Node.js 18.x LTS（互換性あり）

**確認方法:**
```bash
node --version
```

**問題が発生する可能性:**
- Node.js 16以下: Next.js 14が動作しない可能性
- Node.js 21以上: 一部パッケージで互換性問題の可能性

---

### npm/yarn/pnpm

**推奨:**
- npm 10.x（Node.js 20に同梱）
- または pnpm 8.x（高速でディスク容量節約）

**確認方法:**
```bash
npm --version
# または
pnpm --version
```

**既知の問題:**
- npm 7以下: 一部パッケージのインストールに問題
- yarn 1.x: Next.js 14で一部問題が報告されている

---

### パッケージマネージャーの選択

**npm（推奨）:**
- ✅ 標準的で互換性が高い
- ✅ Next.js公式ドキュメントで使用
- ⚠️ やや遅い

**pnpm（推奨）:**
- ✅ 高速
- ✅ ディスク容量節約
- ⚠️ 一部のパッケージで問題が発生する可能性

**yarn:**
- ✅ 高速
- ⚠️ Next.js 14で一部問題が報告されている

---

## 🚨 よくある構築エラーと解決方法

### 1. Module not found エラー

**症状:**
```
Module not found: Can't resolve '@zxing/library'
```

**原因:**
- パッケージがインストールされていない
- パッケージマネージャーのキャッシュ問題

**解決方法:**
```bash
# 依存関係を再インストール
rm -rf node_modules package-lock.json
npm install

# または、特定のパッケージのみ再インストール
npm install @zxing/library --force
```

---

### 2. TypeScript型エラー

**症状:**
```
Property 'xxx' does not exist on type 'yyy'
```

**原因:**
- 型定義ファイルが不足
- TypeScriptのバージョン不一致

**解決方法:**
```bash
# 型定義をインストール
npm install -D @types/package-name

# TypeScriptのバージョンを確認
npx tsc --version
```

---

### 3. Next.jsビルドエラー

**症状:**
```
Error: Cannot find module 'next-pwa'
```

**原因:**
- パッケージのインストール漏れ
- next.config.jsの設定ミス

**解決方法:**
```bash
# パッケージをインストール
npm install next-pwa

# next.config.jsを確認
# CommonJS形式で記述されているか確認
```

---

### 4. 環境変数が読み込まれない

**症状:**
```
process.env.GOOGLE_CLIENT_ID is undefined
```

**原因:**
- `.env.local`ファイルが存在しない
- 環境変数名の誤り
- サーバー再起動が必要

**解決方法:**
```bash
# .env.localファイルの存在確認
ls -la .env.local

# 環境変数の確認（開発サーバー再起動後）
# サーバーを再起動
npm run dev
```

---

### 5. PWA Service Workerエラー

**症状:**
```
Service Worker registration failed
```

**原因:**
- HTTPS環境でない（localhost除く）
- next-pwaの設定ミス

**解決方法:**
```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // 開発環境では無効化
})
```

---

### 6. postcss-selector-parser / autoprefixer の Module not found

**症状:**
```
Error: Cannot find module 'postcss-selector-parser'
```
または
```
Error: Cannot find module './flex-spec'
```
（flex-spec は autoprefixer 内のモジュール）

**原因:**
- `node_modules` が破損または不完全（オフラインやキャッシュのみで `npm install` した場合など）
- 一部パッケージに `package.json` や必要なファイルが欠けている

**解決方法:**

1. **開発サーバーや IDE をいったん終了**（`node_modules` 内のファイルがロックされないようにする）

2. **オフライン設定を解除してからインストール**
   - PowerShell の場合:
     ```powershell
     $env:npm_config_offline = $null
     npm install
     ```
   - コマンドプロンプトの場合:
     ```cmd
     set npm_config_offline=
     npm install
     ```

3. **クリーンインストール**（上記で治らない場合）
   ```powershell
   # node_modules を削除（PowerShell）
   Remove-Item -Recurse -Force node_modules

   # オフラインを解除してからインストール
   $env:npm_config_offline = $null
   npm install
   ```

4. **`package.json` に `postcss-selector-parser` が入っているか確認**  
   入っていなければ追加:
   ```bash
   npm install postcss-selector-parser@^6.1.2
   ```

**補足:**  
`next/font` で Google Fonts の取得に失敗する場合は、`app/layout.tsx` で `next/font/google` の代わりに Tailwind の `font-sans` を使うと、ビルド時の外部アクセスを避けられます。

---

## 📋 インストール前チェックリスト

### 環境確認
- [ ] Node.js 18.x以上がインストールされている
- [ ] npm 10.x以上がインストールされている
- [ ] 十分なディスク容量がある（最低2GB）

### プロジェクト準備
- [ ] プロジェクトディレクトリが空である
- [ ] Gitリポジトリが初期化されている（推奨）
- [ ] `.gitignore`が設定されている

### 依存関係インストール順序

1. **基本フレームワーク**
   ```bash
   npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
   ```

2. **認証ライブラリ**
   ```bash
   npm install next-auth@beta @auth/core
   ```

3. **Google API**
   ```bash
   npm install googleapis google-spreadsheet
   ```

4. **UI・状態管理**
   ```bash
   npm install zustand @tanstack/react-query
   ```

5. **機能ライブラリ**
   ```bash
   npm install @zxing/library recharts
   ```

6. **PWA**
   ```bash
   npm install next-pwa
   ```

7. **開発依存関係**
   ```bash
   npm install -D @types/node eslint-config-next prettier
   ```

---

## 🔧 トラブルシューティング手順

### ステップ1: エラーメッセージの確認
1. エラーメッセージを完全にコピー
2. エラーが発生したコマンドを記録
3. エラーが発生したタイミングを記録

### ステップ2: 基本的な確認
```bash
# Node.jsバージョン確認
node --version

# npmバージョン確認
npm --version

# パッケージのインストール状態確認
npm list --depth=0
```

### ステップ3: クリーンインストール
```bash
# node_modulesとロックファイルを削除
rm -rf node_modules package-lock.json

# キャッシュクリア
npm cache clean --force

# 再インストール
npm install
```

### ステップ4: バージョン固定
```bash
# package.jsonのバージョンを固定
# 例: "next": "14.2.0" のように固定バージョンを指定

# 再インストール
npm install
```

### ステップ5: 段階的インストール
問題が発生した場合、パッケージを1つずつインストールして原因を特定

```bash
# 1つずつインストールしてテスト
npm install next-auth@beta
npm run dev  # 動作確認

npm install googleapis
npm run dev  # 動作確認

# ... 以下同様
```

---

## 📚 参考リソース

### 公式ドキュメント
- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js v5 Documentation](https://authjs.dev/)
- [Google APIs Node.js Client](https://github.com/googleapis/google-api-nodejs-client)
- [ZXing Library](https://github.com/zxing-js/library)

### 互換性チェック
- [Next.js Compatibility](https://nextjs.org/docs/app/building-your-application/upgrading/version-history)
- [npm Package Compatibility](https://www.npmjs.com/)

### コミュニティ
- [Next.js GitHub Issues](https://github.com/vercel/next.js/issues)
- [NextAuth.js Discussions](https://github.com/nextauthjs/next-auth/discussions)
