# ✅ マスターチェックリスト

## 📋 このチェックリストの使い方

このチェックリストは、在庫注文管理システムの開発を**最初から最後まで**進めるための全体管理表です。

### 使い方

1. **各セクションのチェックボックス（☐）にチェックを入れながら進めてください**
2. **完了した項目には ✅ を付けます**
3. **進行中の項目には 🔄 を付けます**
4. **問題が発生した項目には ⚠️ を付けます**

### 進捗の確認

- **準備編**: 5/5 完了 ✅
- **環境構築編**: 2/2 完了 ✅
- **プロジェクト作成編**: 2/2 完了 ✅
- **設定編**: 4/4 完了 ✅
- **データベース準備編**: 6/6 完了 ✅
- **動作確認編**: 2/2 完了 ✅
- **機能実装**: 3/3 完了（フェーズ1-3）✅

---

## 📚 ドキュメントの読み方

### 初心者の方
1. **[BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md)** を最初から順番に読み進めてください
2. このチェックリストで進捗を管理してください

### 経験者の方
1. **[QUICK_START.md](./QUICK_START.md)** でクイックスタート
2. **[STEP_BY_STEP_GUIDE.md](./STEP_BY_STEP_GUIDE.md)** で詳細な実装
3. このチェックリストで進捗を管理してください

---

## 🎯 準備編：必要なものを揃える

### 必要なもの

- [x] パソコン（Windows、Mac、Linuxのいずれか）✅
- [x] インターネット接続 ✅
- [x] Googleアカウント（GmailアカウントがあればOK）✅
- [x] Excelファイル（データベースのテンプレート）✅
- [x] テキストエディタ（VSCode推奨）✅

**詳細：** [BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md#準備編必要なものを揃える)

---

## 🛠️ 環境構築編：開発環境を整える

### ステップ1: Node.jsのインストール

- [x] Node.jsの公式サイトにアクセス ✅
- [x] LTS版をダウンロード ✅
- [x] インストーラーを実行 ✅
- [x] `node --version` コマンドでバージョン確認 ✅
- [x] バージョンが18以上であることを確認 ✅

**詳細：** [BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md#ステップ1-nodejsのインストール)

---

### ステップ2: VSCodeのインストール（推奨）

- [x] VSCodeの公式サイトにアクセス ✅
- [x] VSCodeをダウンロード ✅
- [x] インストーラーを実行 ✅
- [x] VSCodeを起動できることを確認 ✅

**詳細：** [BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md#ステップ2-vscodeのインストール推奨)

---

## 📁 プロジェクト作成編：プロジェクトを作成する

### ステップ3: プロジェクトフォルダの準備

- [x] 作業用フォルダ「Inventory_Control_2」を作成 ✅
- [x] VSCodeでフォルダを開く ✅

**詳細：** [BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md#ステップ3-プロジェクトフォルダの準備)

---

### ステップ4: Next.jsプロジェクトの作成

- [x] VSCodeのターミナルを開く ✅
- [x] `npx create-next-app@latest . --typescript --tailwind --app --no-src-dir` を実行 ✅
- [x] 質問に答える（TypeScript: Y, ESLint: Y, Tailwind: Y, src/: N, App Router: Y）✅
- [x] インストール完了を待つ ✅
- [x] エラーが発生しなかったことを確認 ✅

**詳細：** [BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md#ステップ4-nextjsプロジェクトの作成)

---

### ステップ5: 必要なライブラリのインストール

- [x] `npm install next-auth@beta @auth/core` を実行 ✅
- [x] `npm install googleapis google-spreadsheet` を実行 ✅
- [x] `npm install @zxing/library` を実行 ✅
- [x] `npm install recharts` を実行 ✅
- [x] `npm install zustand @tanstack/react-query` を実行 ✅
- [x] `npm install next-pwa` を実行 ✅
- [x] `npm install clsx tailwind-merge class-variance-authority lucide-react @radix-ui/react-slot` を実行 ✅
- [x] すべてのコマンドがエラーなく実行されたことを確認 ✅

**詳細：** [BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md#ステップ5-必要なライブラリのインストール)

---

## ⚙️ 設定編：各種設定を行う

### ステップ6: Google Cloud Consoleの設定

#### 6.1 プロジェクトの作成

- [x] Google Cloud Consoleにアクセス ✅
- [x] Googleアカウントでログイン ✅
- [x] 新しいプロジェクトを作成 ✅
- [x] プロジェクト名を設定（例：`inventory-control`）✅

**詳細：** [BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md#61-プロジェクトの作成)

---

#### 6.2 APIの有効化

- [x] APIライブラリを開く ✅
- [x] Google Sheets APIを有効化 ✅
- [x] Google Drive APIを有効化（推奨）✅

**詳細：** [BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md#62-apiの有効化)

---

#### 6.3 OAuth認証情報の作成（ユーザー認証用）

- [x] OAuth同意画面を設定 ✅
- [x] OAuth 2.0クライアントIDを作成 ✅
- [x] リダイレクトURIを設定（`http://localhost:3000/api/auth/callback/google`）✅
- [x] クライアントIDとシークレットを保存 ✅

**詳細：** [BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md#63-oauth認証情報の作成ユーザー認証用)

---

#### 6.4 サービスアカウントの作成（データベース用）

- [x] サービスアカウントを作成 ✅
- [x] ロールを「エディター」に設定 ✅
- [x] JSONキーをダウンロード ✅
- [x] JSONファイルを `service-account.json` としてプロジェクトフォルダに保存 ✅

**詳細：** [BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md#64-サービスアカウントの作成データベース用)

---

### ステップ7: 環境変数の設定

- [x] `.env.local`ファイルを作成 ✅
- [x] `NEXTAUTH_SECRET`を生成 ✅
- [x] `GOOGLE_CLIENT_ID`を設定 ✅
- [x] `GOOGLE_CLIENT_SECRET`を設定 ✅
- [x] `GOOGLE_APPLICATION_CREDENTIALS=./service-account.json` を設定 ✅
- [x] `SPREADSHEET_ID`を設定 ✅
- [x] すべての値を正しく入力したことを確認 ✅

**詳細：** [BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md#ステップ7-環境変数の設定)

---

## 💾 データベース準備編：Google Spreadsheetを準備する

### ステップ8: ExcelファイルをGoogle Spreadsheetにインポート

#### 8.1 Excelファイルの確認

- [x] Excelファイルを開く ✅
- [x] 必要なシートが含まれているか確認（products, inventory, orders, sales, users）✅
- [x] 各シートの1行目にヘッダーが設定されているか確認 ✅

**詳細：** [BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md#81-excelファイルの確認)

---

#### 8.2 Google Driveにアップロード

- [x] Google Driveにアクセス ✅
- [x] Excelファイルをアップロード ✅

**詳細：** [BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md#82-google-driveにアップロード)

---

#### 8.3 Google Sheetsで開く

- [x] Google Driveから「アプリで開く」→「Google スプレッドシート」を選択 ✅
- [x] または、Google Sheetsから「ファイル」→「インポート」でインポート ✅
- [x] すべてのシートが正しくインポートされたことを確認 ✅

**詳細：** [BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md#83-google-sheetsで開く)

---

#### 8.4 シート名と構造の確認

- [x] 各シートの名前が正しいか確認 ✅
- [x] シート名を変更（必要に応じて）✅
- [x] 各シートの1行目にヘッダーが設定されているか確認 ✅

**詳細：** [BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md#84-シート名と構造の確認)

---

#### 8.5 スプレッドシートIDの取得

- [x] スプレッドシートを開く ✅
- [x] URLからスプレッドシートIDをコピー（`/d/`と`/edit`の間）✅
- [x] `.env.local`ファイルに`SPREADSHEET_ID`を設定 ✅

**詳細：** [BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md#85-スプレッドシートidの取得)

---

#### 8.6 サービスアカウントに共有権限を付与

- [x] `service-account.json`ファイルから`client_email`を確認 ✅
- [x] スプレッドシートの「共有」ボタンをクリック ✅
- [x] サービスアカウントのメールアドレスを追加 ✅
- [x] 権限を「編集者」に設定 ✅
- [x] 共有権限が正しく設定されたことを確認 ✅（データ読み取り成功で確認済み）

**詳細：** [BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md#86-サービスアカウントに共有権限を付与)

---

## ✅ 動作確認編：動作を確認する

### ステップ9: 開発サーバーの起動

- [x] VSCodeのターミナルを開く ✅
- [x] `npm run dev` を実行 ✅
- [x] 開発サーバーが起動するまで待つ ✅
- [x] ブラウザで `http://localhost:3000` にアクセス ✅
- [x] ページが表示されることを確認 ✅

**詳細：** [BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md#ステップ9-開発サーバーの起動)

---

### ステップ10: 認証機能のテスト

- [x] `http://localhost:3000/login` にアクセス ✅
- [x] Googleログインボタンが表示されることを確認 ✅
- [x] ログインを試す ✅
- [x] 正常にログインできることを確認 ✅

**詳細：** [BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md#ステップ10-認証機能のテスト)

---

## 🚀 次のステップ：機能実装

### フェーズ1: プロジェクト基盤構築

- [x] ディレクトリ構造の作成 ✅
- [x] 基本ファイルの作成 ✅
- [x] shadcn/uiのセットアップ ✅（Buttonコンポーネント実装済み）

**詳細：** [STEP_BY_STEP_GUIDE.md](./STEP_BY_STEP_GUIDE.md#フェーズ1-プロジェクト基盤構築)

---

### フェーズ2: 認証機能実装

- [x] NextAuth.jsの設定 ✅（`lib/auth/config.ts`に実装済み）
- [x] ログインページの作成 ✅（`app/login/page.tsx`実装済み）
- [x] セッション管理の実装 ✅（`lib/auth/session.ts`実装済み）
- [x] 認証APIルートの実装 ✅（`/api/auth/[...nextauth]`実装済み）
- [x] ログアウトAPIルートの実装 ✅（`/api/auth/signout`実装済み）
- [x] ホームページの実装 ✅（`app/page.tsx` - 認証ガード付き実装済み）

**詳細：** [STEP_BY_STEP_GUIDE.md](./STEP_BY_STEP_GUIDE.md#フェーズ2-認証機能実装)

---

### フェーズ3: Google Spreadsheet連携

- [x] Google Sheets APIクライアントの作成 ✅（`lib/google-sheets/client.ts`実装済み）
- [x] データ読み書き関数の作成 ✅（`lib/google-sheets/read.ts`, `write.ts`実装済み）
- [x] インポートしたデータの読み取りテスト ✅（`/api/test-sheets`で成功確認済み）
- [x] 商品データアクセス層の実装 ✅（`lib/google-sheets/products.ts`実装済み）
- [x] 在庫データアクセス層の実装 ✅（`lib/google-sheets/inventory.ts`実装済み）
- [x] 商品一覧ページの実装 ✅（`app/products/page.tsx`実装済み）
- [x] 商品APIルートの実装 ✅（`/api/products` - GET, POST実装済み）
- [x] 商品詳細APIルートの実装 ✅（`/api/products/[id]` - GET, PUT, DELETE実装済み）
- [x] 在庫APIルートの実装 ✅（`/api/inventory` - GET, POST実装済み）
- [x] 在庫詳細APIルートの実装 ✅（`/api/inventory/[productId]` - GET, PUT, DELETE実装済み）

**詳細：** [STEP_BY_STEP_GUIDE.md](./STEP_BY_STEP_GUIDE.md#フェーズ3-google-spreadsheet連携)

---

### フェーズ4: 在庫管理機能（完了）

- [x] 商品詳細ページの実装 ✅（`app/products/[id]/page.tsx`実装済み）
- [x] 商品登録ページの実装 ✅（`app/products/new/page.tsx`実装済み）
- [x] 在庫管理ページの実装 ✅（`app/inventory/page.tsx`実装済み）
- [x] 在庫数量変更ページの実装 ✅（`app/inventory/[productId]/page.tsx`実装済み）
- [x] ホームページの在庫管理リンク有効化 ✅
- [x] バーコードスキャン機能 ✅（`components/barcode/BarcodeScanner.tsx`、注文・在庫・商品登録に統合済み）
- [x] 商品一覧への画像表示 ✅（ProductsTableで実装済み）

**詳細：** [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) を参照してください。

---

## 📊 進捗サマリー

### 全体進捗

- **準備・環境構築**: ✅ 完了
- **プロジェクト作成**: ✅ 完了
- **設定**: ✅ 完了
- **データベース準備**: ✅ 完了
- **動作確認**: ✅ 完了
- **機能実装（フェーズ1-3）**: ✅ 完了
- **機能実装（フェーズ4以降）**: 🔄 進行中

### 完了率

**約75%** 完了（商品・在庫・受注管理完了、売上管理・PWA対応が残り）

### フェーズ5: 受注管理機能

- [x] 受注データアクセス層の実装 ✅（`lib/google-sheets/orders.ts`実装済み）
- [x] 受注APIルートの実装 ✅（`/api/orders` - GET, POST実装済み）
- [x] 注文ステータス更新API ✅（`/api/orders/[id]` - PUT実装済み）
- [x] バーコード検索API ✅（`/api/orders/barcode` - GET実装済み）
- [x] 注文一覧ページの実装 ✅（`app/orders/page.tsx`実装済み）
- [x] 新規注文作成ページの実装 ✅（`app/orders/new/page.tsx`実装済み）
- [x] 注文詳細ページの実装 ✅（`app/orders/[id]/page.tsx`実装済み）
- [x] ホームページの受注管理リンク有効化 ✅

### フェーズ6: 売上管理機能（完了）

- [x] 売上データアクセス層 ✅（`lib/google-sheets/sales.ts`実装済み）
- [x] 注文完了時の売上レコード自動作成 ✅（`updateOrderStatus`で実装済み）
- [x] 売上API ✅（`/api/sales` - GET実装済み）
- [x] 売上一覧ページ ✅（`app/sales/page.tsx`実装済み）
- [x] 売上レポートページ ✅（`app/sales/reports/page.tsx` - 日別推移・商品別分析）
- [x] ホームページの売上管理リンク有効化 ✅

### 次のステップ

- フェーズ7: ダッシュボードの強化
- フェーズ8: PWA対応

---

## 💡 ヒント

- **1つずつ確実に進めることが大切です**
- **分からないことがあれば、その都度調べましょう**
- **エラーが発生したら、エラーメッセージをコピーしてGoogleで検索してみてください**
- **各ステップのチェックポイントを必ず確認してください**

---

## 📞 サポート

問題が発生した場合：

1. 該当するステップの「トラブルシューティング」セクションを確認
2. [DEPENDENCY_ANALYSIS.md](./DEPENDENCY_ANALYSIS.md) を参照
3. [QUICK_START.md](./QUICK_START.md) の「よくある問題と解決方法」を確認

---

**最終更新日：** 2026年1月24日（進捗更新）
