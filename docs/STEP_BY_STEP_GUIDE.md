# ステップバイステップ実装ガイド

## 📖 このガイドについて

このガイドは、在庫注文管理システムを**ステップバイステップで着実に**実装するための詳細な手順書です。各ステップで動作確認を行いながら進めることで、問題を早期に発見し、確実に完成させることができます。

---

## 🎯 実装の原則

1. **小さく始める**: 各ステップで最小限の機能を実装
2. **動作確認**: 各ステップの後に必ず動作確認
3. **問題の早期発見**: 問題が発生したら、そのステップで解決
4. **段階的拡張**: 基本機能が動作してから拡張機能を追加

---

## 📋 フェーズ1: プロジェクト基盤構築

### ステップ1.1: プロジェクト初期化

#### 1.1.1 環境確認
```bash
# Node.jsバージョン確認（18.x以上推奨）
node --version

# npmバージョン確認（10.x以上推奨）
npm --version

# 現在のディレクトリ確認
pwd
```

#### 1.1.2 Next.jsプロジェクト作成
```bash
# プロジェクト作成（対話形式）
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir

# 質問への回答:
# - TypeScript: Yes
# - ESLint: Yes
# - Tailwind CSS: Yes
# - `src/` directory: No
# - App Router: Yes
# - Import alias: @/*
```

#### 1.1.3 動作確認
```bash
# 開発サーバー起動
npm run dev

# ブラウザで http://localhost:3000 にアクセス
# "Get started by editing app/page.tsx" が表示されればOK
```

**✅ チェックポイント:**
- [ ] 開発サーバーが起動する
- [ ] ブラウザでページが表示される
- [ ] エラーが発生しない

---

### ステップ1.2: 基本依存関係のインストール

#### 1.2.1 認証ライブラリ
```bash
npm install next-auth@beta @auth/core
```

**動作確認:**
```bash
npm run dev
# エラーが発生しないことを確認
```

#### 1.2.2 Google APIライブラリ
```bash
npm install googleapis google-spreadsheet
```

**動作確認:**
```bash
npm run dev
# エラーが発生しないことを確認
```

#### 1.2.3 状態管理ライブラリ
```bash
npm install zustand @tanstack/react-query
```

**動作確認:**
```bash
npm run dev
# エラーが発生しないことを確認
```

#### 1.2.4 機能ライブラリ
```bash
npm install @zxing/library recharts
```

**動作確認:**
```bash
npm run dev
# エラーが発生しないことを確認
```

#### 1.2.5 PWAライブラリ
```bash
npm install next-pwa
```

**動作確認:**
```bash
npm run dev
# エラーが発生しないことを確認
```

**✅ チェックポイント:**
- [ ] すべてのパッケージがインストールされた
- [ ] `package.json`に依存関係が追加された
- [ ] 開発サーバーが正常に起動する

---

### ステップ1.3: ディレクトリ構造の作成

#### 1.3.1 ディレクトリ作成
```bash
# Windows PowerShellの場合
mkdir app\api\auth\[...nextauth]
mkdir app\api\products
mkdir app\api\inventory
mkdir app\api\orders
mkdir app\api\sales
mkdir components\ui
mkdir components\barcode
mkdir components\charts
mkdir components\layout
mkdir lib\google-sheets
mkdir lib\auth
mkdir lib\utils
mkdir types
mkdir hooks
mkdir store
```

#### 1.3.2 基本ファイル作成

**`types/index.ts`**
```typescript
// 基本的な型定義（後で拡張）
export type UserRole = 'admin' | 'user'
```

**注意:** `lib/utils/cn.ts`ファイルは、ステップ1.4で`clsx`と`tailwind-merge`をインストールした後に作成します。

**動作確認:**
```bash
npm run dev
# エラーが発生しないことを確認
```

**✅ チェックポイント:**
- [ ] すべてのディレクトリが作成された
- [ ] 基本ファイルが作成された（cn.tsは後で作成）
- [ ] TypeScriptのエラーが発生しない（cn.ts関連のエラーは無視）

---

### ステップ1.4: shadcn/uiのセットアップ

#### 1.4.0 cn.tsファイルの作成（先に作成）

**`lib/utils/cn.ts`を作成**
```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

#### 1.4.1 必要なパッケージのインストール
```bash
# shadcn/uiのコア依存関係（cn関数に必要）
npm install clsx tailwind-merge

# shadcn/uiのその他の依存関係
npm install class-variance-authority lucide-react

# Radix UIコンポーネント（Button用）
npm install @radix-ui/react-slot
```

**動作確認:**
```bash
npm run dev
# cn.tsのエラーが解消されることを確認
```

#### 1.4.2 Tailwind設定の確認
**`tailwind.config.ts`** を確認・更新:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
```

#### 1.4.3 基本コンポーネントの追加

**`components/ui/button.tsx`を作成**

**`components/ui/button.tsx`**
```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

**補足:**
- shadcn/uiはコンポーネントをコピー&ペーストで使用するライブラリです
- 必要に応じて他のコンポーネント（Input, Card, Dialog等）も同様に追加できます
- 公式サイト: https://ui.shadcn.com/

**動作確認:**
```bash
npm run dev
# エラーが発生しないことを確認
```

**✅ チェックポイント:**
- [ ] shadcn/uiの依存関係がインストールされた
- [ ] Buttonコンポーネントが作成された
- [ ] TypeScriptのエラーが発生しない

---

### ステップ1.5: 環境変数ファイルの作成

#### 1.5.1 `.env.local`ファイル作成
```bash
# .env.local ファイルを作成
```

**`.env.local`**（テンプレート）
```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth（後で設定）
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Google Spreadsheet（後で設定）
SPREADSHEET_ID=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=

# または、サービスアカウントJSONファイルのパス
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
```

#### 1.5.2 NEXTAUTH_SECRETの生成
```bash
# PowerShellの場合
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString()))
```

生成された値を`.env.local`の`NEXTAUTH_SECRET`に設定

**✅ チェックポイント:**
- [ ] `.env.local`ファイルが作成された
- [ ] `.gitignore`に`.env.local`が追加されている（確認）
- [ ] NEXTAUTH_SECRETが設定された

---

## 📋 フェーズ2: 認証機能実装

### ステップ2.1: Google Cloud Console設定

#### 2.1.1 プロジェクト作成
1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成（例: `inventory-control`）

#### 2.1.2 API有効化
1. 「APIとサービス」→「ライブラリ」
2. 以下を有効化:
   - Google Sheets API
   - Google Drive API（必要に応じて）

#### 2.1.3 OAuth認証情報作成
1. 「認証情報」→「認証情報を作成」→「OAuth 2.0 クライアント ID」
2. アプリケーションの種類: ウェブアプリケーション
3. 承認済みのリダイレクト URI: `http://localhost:3000/api/auth/callback/google`
4. クライアントIDとシークレットをコピー

#### 2.1.4 サービスアカウント作成
1. 「認証情報」→「認証情報を作成」→「サービスアカウント」
2. サービスアカウント名を入力
3. ロール: エディター
4. JSONキーをダウンロード（`service-account.json`として保存）

**✅ チェックポイント:**
- [ ] Google Cloudプロジェクトが作成された
- [ ] APIが有効化された
- [ ] OAuth認証情報が取得された
- [ ] サービスアカウントJSONキーがダウンロードされた

---

### ステップ2.2: 環境変数の設定

#### 2.2.1 `.env.local`の更新
```env
# Google OAuth
GOOGLE_CLIENT_ID=your-actual-client-id
GOOGLE_CLIENT_SECRET=your-actual-client-secret

# Google Spreadsheet
SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
```

#### 2.2.2 サービスアカウントJSONの配置
- `service-account.json`をプロジェクトルートに配置
- `.gitignore`に`service-account.json`が追加されていることを確認

**✅ チェックポイント:**
- [ ] 環境変数が正しく設定された
- [ ] サービスアカウントJSONが配置された
- [ ] `.gitignore`が適切に設定された

---

### ステップ2.3: NextAuth.jsの設定

#### 2.3.1 認証ルートの作成
**`app/api/auth/[...nextauth]/route.ts`**
```typescript
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      return session
    },
  },
})

export { handler as GET, handler as POST }
```

#### 2.3.2 セッション取得ユーティリティ
**`lib/auth/session.ts`**
```typescript
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function getSession() {
  return await getServerSession(authOptions)
}
```

**動作確認:**
```bash
npm run dev
# http://localhost:3000/api/auth/signin にアクセス
# Googleログインボタンが表示されればOK
```

**✅ チェックポイント:**
- [ ] 認証ルートが作成された
- [ ] `/api/auth/signin`にアクセスできる
- [ ] Googleログインボタンが表示される

---

### ステップ2.4: ログインページの作成

#### 2.4.1 ログインページ作成
**`app/login/page.tsx`**
```typescript
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold">
            在庫管理システムにログイン
          </h2>
        </div>
        <Button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full"
        >
          Googleでログイン
        </Button>
      </div>
    </div>
  )
}
```

**動作確認:**
```bash
npm run dev
# http://localhost:3000/login にアクセス
# ログインボタンが表示され、クリックでGoogle認証が開始されればOK
```

**✅ チェックポイント:**
- [ ] ログインページが表示される
- [ ] Googleログインボタンが動作する
- [ ] 認証後にリダイレクトされる

---

## 📋 フェーズ3: Google Spreadsheet連携

### ステップ3.1: Spreadsheet準備

#### 3.1.1 Excelテンプレートの確認
1. 準備したExcelファイルを開く
2. 以下のシートが含まれているか確認:
   - `products`（商品マスタ）
   - `inventory`（在庫）
   - `orders`（受注）
   - `sales`（売上）
   - `users`（ユーザー権限）
3. 各シートの1行目にヘッダーが設定されているか確認

**期待されるヘッダー構造:**

**productsシート:**
```
productId | name | barcode | price | category | createdAt | updatedAt
```

**inventoryシート:**
```
productId | quantity | minStock | lastUpdated | updatedBy
```

**ordersシート:**
```
orderId | productId | quantity | unitPrice | total | status | orderDate | updatedAt
```

**salesシート:**
```
saleId | orderId | productId | quantity | unitPrice | total | saleDate
```

**usersシート:**
```
userId | email | role | createdAt
```

**✅ チェックポイント:**
- [ ] Excelファイルに必要なシートが含まれている
- [ ] 各シートのヘッダー行が正しく設定されている
- [ ] データ型が適切である（数値は数値、日付は日付など）

---

#### 3.1.2 ExcelファイルをGoogle Spreadsheetにインポート

**方法1: Google Drive経由でインポート（推奨）**

1. **Google DriveにExcelファイルをアップロード**
   - [Google Drive](https://drive.google.com/)にアクセス
   - 「新規」→「ファイルをアップロード」をクリック
   - Excelファイルを選択してアップロード

2. **Google Sheetsで開く**
   - アップロードしたExcelファイルを右クリック
   - 「アプリで開く」→「Google スプレッドシート」を選択
   - または、ファイルをダブルクリックして開く

3. **Google Spreadsheetとして保存**
   - ファイルが自動的にGoogle Spreadsheet形式に変換されます
   - 「ファイル」→「名前を変更」で適切な名前に変更（例: `在庫管理システム`）

**方法2: Google Sheetsから直接インポート**

1. [Google Sheets](https://sheets.google.com/)にアクセス
2. 「空白」をクリックして新しいスプレッドシートを作成
3. 「ファイル」→「インポート」をクリック
4. 「アップロード」タブを選択
5. Excelファイルをドラッグ&ドロップまたは「デバイスのファイルを選択」
6. インポート設定を確認:
   - **インポート場所**: 「新しいスプレッドシートを作成」または「現在のスプレッドシートに置き換える」
   - **変換**: 「Google スプレッドシートに変換」を選択
7. 「データをインポート」をクリック

**✅ チェックポイント:**
- [ ] ExcelファイルがGoogle Spreadsheetに正常にインポートされた
- [ ] すべてのシートが正しくインポートされた
- [ ] データが正しく表示されている

---

#### 3.1.3 シート名と構造の確認・調整

1. **シート名の確認**
   - 各シートのタブを確認
   - シート名が以下の通りか確認:
     - `products`（商品マスタ）
     - `inventory`（在庫）
     - `orders`（受注）
     - `sales`（売上）
     - `users`（ユーザー権限）

2. **シート名の変更（必要に応じて）**
   - シートタブをダブルクリック
   - 正しい名前に変更
   - 日本語名の場合は、英語名に変更することを推奨

3. **ヘッダー行の確認**
   - 各シートの1行目にヘッダーが正しく設定されているか確認
   - ヘッダーが2行目以降にある場合は、1行目に移動

4. **データ型の確認**
   - 数値列（price, quantity, unitPrice等）が数値型になっているか確認
   - 日付列（createdAt, updatedAt等）が日付型になっているか確認

**✅ チェックポイント:**
- [ ] すべてのシート名が正しい
- [ ] 各シートの1行目にヘッダーが設定されている
- [ ] データ型が適切に設定されている

---

#### 3.1.4 スプレッドシートIDの取得

1. **スプレッドシートを開く**
   - Google Spreadsheetを開く

2. **スプレッドシートIDをコピー**
   - URLを確認: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - `/d/`と`/edit`の間の文字列がスプレッドシートIDです
   - 例: `https://docs.google.com/spreadsheets/d/1ABC123xyz789/edit`
     → スプレッドシートIDは `1ABC123xyz789`

3. **スプレッドシートIDを保存**
   - 後で`.env.local`に設定するため、メモ帳などに保存

**✅ チェックポイント:**
- [ ] スプレッドシートIDが正しく取得できた
- [ ] スプレッドシートIDを安全な場所に保存した

---

#### 3.1.5 サービスアカウントに共有権限付与

1. **サービスアカウントのメールアドレスを確認**
   - ステップ2.1.4でダウンロードした`service-account.json`を開く
   - `client_email`の値をコピー（例: `inventory-control@project-id.iam.gserviceaccount.com`）

2. **スプレッドシートに共有権限を付与**
   - Google Spreadsheetの右上の「共有」ボタンをクリック
   - 「ユーザーやグループを追加」欄にサービスアカウントのメールアドレスを貼り付け
   - 権限を「編集者」に設定
   - 「送信」をクリック

3. **共有権限の確認**
   - 共有設定でサービスアカウントが「編集者」として表示されていることを確認

**✅ チェックポイント:**
- [ ] サービスアカウントのメールアドレスが正しく取得できた
- [ ] スプレッドシートにサービスアカウントが「編集者」として追加された
- [ ] 共有権限が正しく設定された

---

#### 3.1.6 環境変数の更新

1. **`.env.local`ファイルを開く**

2. **スプレッドシートIDを設定**
   ```env
   SPREADSHEET_ID=your-actual-spreadsheet-id
   ```
   ステップ3.1.4で取得したスプレッドシートIDに置き換え

3. **設定の確認**
   ```env
   # Google Spreadsheet
   SPREADSHEET_ID=1ABC123xyz789  # 実際のIDに置き換え
   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
   ```

**✅ チェックポイント:**
- [ ] `.env.local`にスプレッドシートIDが正しく設定された
- [ ] 環境変数の形式が正しい（余分なスペースや引用符がない）

---

#### 3.1.7 データ構造の最終確認

1. **各シートのデータ構造を確認**
   - 各シートを開いて、以下の点を確認:
     - ヘッダー行が1行目にある
     - 列の順序が正しい
     - データ型が適切

2. **テストデータの追加（オプション）**
   - 必要に応じて、各シートに1-2行のテストデータを追加
   - 後でAPI経由で読み取れるかテストします

**推奨テストデータ:**

**productsシート:**
```
PROD001 | テスト商品A | 1234567890123 | 1000 | カテゴリ1 | 2026-01-24 | 2026-01-24
```

**inventoryシート:**
```
PROD001 | 50 | 10 | 2026-01-24 | test@example.com
```

**✅ チェックポイント:**
- [ ] すべてのシートの構造が正しい
- [ ] テストデータが追加された（オプション）
- [ ] データが正しく表示されている

---

### ステップ3.2: Google Sheets APIクライアント作成

#### 3.2.1 認証クライアント作成
**`lib/google-sheets/auth.ts`**
```typescript
import { google } from 'googleapis'

export function getAuth() {
  return new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
}
```

#### 3.2.2 Sheets APIクライアント作成
**`lib/google-sheets/client.ts`**
```typescript
import { google } from 'googleapis'
import { getAuth } from './auth'

export async function getSheetsClient() {
  const auth = await getAuth()
  return google.sheets({ version: 'v4', auth })
}
```

**動作確認:**
```bash
npm run dev
# エラーが発生しないことを確認
```

**✅ チェックポイント:**
- [ ] 認証クライアントが作成された
- [ ] Sheets APIクライアントが作成された
- [ ] TypeScriptのエラーが発生しない

---

### ステップ3.3: データ読み書き関数の作成

#### 3.3.1 データ読み取り関数
**`lib/google-sheets/read.ts`**
```typescript
import { getSheetsClient } from './client'

export async function readSheet(sheetName: string, range?: string) {
  const sheets = await getSheetsClient()
  const spreadsheetId = process.env.SPREADSHEET_ID!
  
  const rangeString = range ? `${sheetName}!${range}` : `${sheetName}!A:Z`
  
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: rangeString,
  })
  
  return response.data.values || []
}
```

#### 3.3.2 データ書き込み関数
**`lib/google-sheets/write.ts`**
```typescript
import { getSheetsClient } from './client'

export async function appendRow(sheetName: string, values: any[]) {
  const sheets = await getSheetsClient()
  const spreadsheetId = process.env.SPREADSHEET_ID!
  
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:Z`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [values] },
  })
}
```

**動作確認:**
簡単なテストAPI Routeを作成して動作確認

**✅ チェックポイント:**
- [ ] 読み取り関数が作成された
- [ ] 書き込み関数が作成された
- [ ] テストで動作確認ができた

---

### ステップ3.4: インポートしたデータの読み取りテスト

#### 3.4.1 テストAPI Routeの作成

**`app/api/test-sheets/route.ts`を作成**
```typescript
import { NextResponse } from 'next/server'
import { readSheet } from '@/lib/google-sheets/read'

export async function GET() {
  try {
    // productsシートのデータを読み取り
    const products = await readSheet('products')
    
    return NextResponse.json({
      success: true,
      message: 'データの読み取りに成功しました',
      data: {
        products: products.slice(0, 5), // 最初の5行のみ表示
        totalRows: products.length,
      },
    })
  } catch (error) {
    console.error('エラー:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'データの読み取りに失敗しました',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
```

#### 3.4.2 動作確認

1. **開発サーバーを起動**
   ```bash
   npm run dev
   ```

2. **テストAPIにアクセス**
   - ブラウザで `http://localhost:3000/api/test-sheets` にアクセス
   - または、curlコマンドで確認:
     ```bash
     curl http://localhost:3000/api/test-sheets
     ```

3. **レスポンスの確認**
   - 正常な場合、以下のようなJSONが返されます:
     ```json
     {
       "success": true,
       "message": "データの読み取りに成功しました",
       "data": {
         "products": [
           ["productId", "name", "barcode", "price", "category", "createdAt", "updatedAt"],
           ["PROD001", "テスト商品A", "1234567890123", "1000", "カテゴリ1", "2026-01-24", "2026-01-24"]
         ],
         "totalRows": 2
       }
     }
     ```

4. **エラーの場合の対処**
   - エラーメッセージを確認
   - よくあるエラー:
     - `Permission denied`: サービスアカウントの共有権限を確認
     - `Unable to parse range`: シート名が正しいか確認
     - `Spreadsheet not found`: スプレッドシートIDが正しいか確認

**✅ チェックポイント:**
- [ ] テストAPI Routeが作成された
- [ ] APIにアクセスしてデータが読み取れる
- [ ] エラーが発生しない
- [ ] インポートしたデータが正しく表示される

---

#### 3.4.3 他のシートのテスト（オプション）

必要に応じて、他のシートもテストできます:

**`app/api/test-sheets/route.ts`を拡張**
```typescript
import { NextResponse } from 'next/server'
import { readSheet } from '@/lib/google-sheets/read'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sheetName = searchParams.get('sheet') || 'products'
  
  try {
    const data = await readSheet(sheetName)
    
    return NextResponse.json({
      success: true,
      sheetName,
      data: data.slice(0, 5), // 最初の5行のみ表示
      totalRows: data.length,
    })
  } catch (error) {
    console.error('エラー:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'データの読み取りに失敗しました',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
```

**使用方法:**
- `http://localhost:3000/api/test-sheets?sheet=products`
- `http://localhost:3000/api/test-sheets?sheet=inventory`
- `http://localhost:3000/api/test-sheets?sheet=orders`

---

## 🎯 次のステップ

フェーズ1-3が完了したら、`DEVELOPMENT_PLAN.md`のフェーズ4以降に進みます。

各フェーズで同様にステップバイステップで実装を進めていきます。

---

## 💡 トラブルシューティング

各ステップで問題が発生した場合:

1. **エラーメッセージを確認**
2. **`DEPENDENCY_ANALYSIS.md`を参照**
3. **前のステップに戻って確認**
4. **必要に応じてクリーンインストール**

問題が解決しない場合は、そのステップで一旦停止し、問題を解決してから次に進みましょう。
