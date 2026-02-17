# クイックスタートガイド

## 🚀 開発開始までの手順

### ステップ1: プロジェクト初期化

```bash
# Next.jsプロジェクト作成
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir

# 必要な依存関係をインストール
npm install next-auth@beta @auth/core
npm install googleapis google-spreadsheet
npm install @zxing/library
npm install recharts
npm install zustand
npm install @tanstack/react-query
npm install next-pwa

# 開発依存関係
npm install -D @types/node
```

### ステップ2: Google Cloud Console設定

1. **プロジェクト作成**
   - [Google Cloud Console](https://console.cloud.google.com/)にアクセス
   - 新しいプロジェクトを作成（例: `inventory-control`）

2. **API有効化**
   - 「APIとサービス」→「ライブラリ」
   - 以下を有効化:
     - Google Sheets API
     - Google Drive API（必要に応じて）

3. **認証情報作成**
   
   **OAuth 2.0認証情報（ユーザー認証用）:**
   - 「認証情報」→「認証情報を作成」→「OAuth 2.0 クライアント ID」
   - アプリケーションの種類: ウェブアプリケーション
   - 承認済みのリダイレクト URI: `http://localhost:3000/api/auth/callback/google`
   - クライアントIDとシークレットを保存

   **サービスアカウント（Spreadsheet API用）:**
   - 「認証情報」→「認証情報を作成」→「サービスアカウント」
   - サービスアカウント名を入力
   - ロール: エディター
   - JSONキーをダウンロード（`service-account.json`として保存）

### ステップ3: Google Spreadsheet準備

#### 方法A: Excelテンプレートからインポート（推奨）

1. **Excelファイルの確認**
   - 準備したExcelテンプレートファイルを開く
   - 以下のシートが含まれているか確認:
     - `products`（商品マスタ）
     - `inventory`（在庫）
     - `orders`（受注）
     - `sales`（売上）
     - `users`（ユーザー権限）

2. **Google Driveにアップロード**
   - [Google Drive](https://drive.google.com/)にアクセス
   - 「新規」→「ファイルをアップロード」でExcelファイルをアップロード

3. **Google Sheetsで開く**
   - アップロードしたExcelファイルを右クリック
   - 「アプリで開く」→「Google スプレッドシート」を選択
   - または、[Google Sheets](https://sheets.google.com/)から「ファイル」→「インポート」でExcelファイルをインポート

4. **シート名と構造の確認**
   - 各シートの名前が正しいか確認（必要に応じて変更）
   - 1行目にヘッダーが設定されているか確認
   - データ型が適切か確認

5. **スプレッドシートIDの取得**
   - URLからスプレッドシートIDをコピー（`/d/`と`/edit`の間）

6. **サービスアカウントに共有権限を付与**
   - スプレッドシートの「共有」ボタンをクリック
   - サービスアカウントのメールアドレス（JSONキー内の`client_email`）を追加
   - 権限: 編集者

#### 方法B: 手動でスプレッドシートを作成

1. **スプレッドシート作成**
   - [Google Sheets](https://sheets.google.com/)で新しいスプレッドシートを作成
   - スプレッドシートIDをコピー（URLの`/d/`と`/edit`の間）

2. **シート作成と構造設定**
   - 以下のシートを作成:
     - `products`（商品マスタ）
     - `inventory`（在庫）
     - `orders`（受注）
     - `sales`（売上）
     - `users`（ユーザー権限）

3. **ヘッダー行設定**
   
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

4. **サービスアカウントに共有権限を付与**
   - スプレッドシートの「共有」ボタンをクリック
   - サービスアカウントのメールアドレス（JSONキー内の`client_email`）を追加
   - 権限: 編集者

**詳細な手順は [`STEP_BY_STEP_GUIDE.md`](./STEP_BY_STEP_GUIDE.md) のステップ3.1を参照してください。**

### ステップ4: 環境変数設定

`.env.local`ファイルを作成:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Google Spreadsheet
SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account-email
GOOGLE_PRIVATE_KEY=your-private-key-from-json

# または、サービスアカウントJSONファイルのパス
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
```

**NEXTAUTH_SECRET生成方法:**
```bash
openssl rand -base64 32
```

### ステップ5: 基本設定ファイル

#### `next.config.js`
```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = withPWA(nextConfig)
```

#### `tsconfig.json`（推奨設定）
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### ステップ6: ディレクトリ構造作成

```bash
mkdir -p app/api/auth/\[...nextauth\]
mkdir -p app/api/products
mkdir -p app/api/inventory
mkdir -p app/api/orders
mkdir -p app/api/sales
mkdir -p components/ui
mkdir -p components/barcode
mkdir -p components/charts
mkdir -p lib/google-sheets
mkdir -p lib/auth
mkdir -p types
mkdir -p hooks
mkdir -p store
```

### ステップ7: 動作確認

1. **開発サーバー起動**
   ```bash
   npm run dev
   ```

2. **認証テスト**
   - `http://localhost:3000/api/auth/signin`にアクセス
   - Googleログインが動作するか確認

3. **Spreadsheet接続テスト**
   - 簡単なAPI Routeを作成してデータ読み取りをテスト

---

## 📝 チェックリスト

### 初期セットアップ
- [ ] Next.jsプロジェクト作成完了
- [ ] 依存関係インストール完了
- [ ] Google Cloud Console設定完了
- [ ] OAuth認証情報取得完了
- [ ] サービスアカウント作成・JSONキー取得完了
- [ ] Google Spreadsheet作成・構造設定完了
- [ ] サービスアカウントに共有権限付与完了
- [ ] 環境変数設定完了
- [ ] 基本設定ファイル作成完了
- [ ] ディレクトリ構造作成完了

### 開発準備
- [ ] 認証動作確認
- [ ] Spreadsheet API接続確認
- [ ] バーコードスキャン動作確認（カメラアクセス）
- [ ] PWA動作確認（Service Worker）

---

## 🐛 よくある問題と解決方法

### 1. Google OAuth認証エラー

**問題:** `redirect_uri_mismatch`エラー

**解決方法:**
- Google Cloud ConsoleでリダイレクトURIを正確に設定
- 開発環境: `http://localhost:3000/api/auth/callback/google`
- 本番環境: `https://your-domain.com/api/auth/callback/google`

### 2. Spreadsheet API接続エラー

**問題:** `Permission denied`エラー

**解決方法:**
- サービスアカウントのメールアドレスをスプレッドシートに共有
- 権限が「編集者」になっているか確認
- JSONキーのパスが正しいか確認

### 3. バーコードスキャンが動作しない

**問題:** カメラにアクセスできない

**解決方法:**
- HTTPS環境で実行（localhost除く）
- ブラウザのカメラ権限を確認
- カメラが他のアプリで使用されていないか確認

### 4. PWAがインストールできない

**問題:** インストールプロンプトが表示されない

**解決方法:**
- `manifest.json`が正しく設定されているか確認
- Service Workerが登録されているか確認
- HTTPS環境で実行（localhost除く）

### 5. 環境変数が読み込まれない

**問題:** `process.env`が`undefined`

**解決方法:**
- `.env.local`ファイルがプロジェクトルートにあるか確認
- 変数名が`NEXT_PUBLIC_`で始まる必要がある（クライアント側で使用する場合）
- サーバー再起動

---

## 📚 参考リソース

### 公式ドキュメント
- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [ZXing Library](https://github.com/zxing-js/library)

### チュートリアル
- [Next.js App Router Guide](https://nextjs.org/docs/app)
- [Google Sheets API Quickstart](https://developers.google.com/sheets/api/quickstart/nodejs)
- [PWA with Next.js](https://web.dev/progressive-web-apps/)

---

## 🎯 次のステップ

1. このガイドに従ってプロジェクトを初期化
2. `DEVELOPMENT_PLAN.md`のフェーズ1から順次実装
3. 各機能を段階的に実装・テスト
4. 本番環境にデプロイ

---

## 💡 開発のヒント

1. **小さく始める**
   - まず認証とSpreadsheet接続を確実に動作させる
   - その後、機能を段階的に追加

2. **テストを書く**
   - 各機能の動作確認を自動化
   - 特にAPI Routesのテストが重要

3. **エラーハンドリング**
   - ユーザーフレンドリーなエラーメッセージ
   - ログ記録でデバッグを容易に

4. **パフォーマンス**
   - Spreadsheet APIの呼び出しを最小限に
   - キャッシュを積極的に活用

5. **セキュリティ**
   - 環境変数の適切な管理
   - 認証・認可の徹底
   - 入力データのバリデーション
