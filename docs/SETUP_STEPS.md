# 🚀 環境設定のステップバイステップガイド

このガイドでは、**初心者の方でも分かりやすく**、在庫管理システムを動作させるための設定を行います。

---

## ✅ ステップ1: 環境変数ファイル（`.env.local`）の設定

### 📝 1.1 `.env.local`ファイルの確認

`.env.local`ファイルがプロジェクトフォルダに作成されています。

**確認方法:**
- VSCodeでプロジェクトフォルダを開く
- 左側のファイル一覧で `.env.local` が表示されているか確認
- 表示されない場合は、VSCodeの設定で「隠しファイルを表示」を有効にしてください

### 🔑 1.2 NEXTAUTH_SECRETの設定

**✅ 完了済み:** `NEXTAUTH_SECRET`は既に生成されて設定されています。

**生成された値:**
```
YjU5NTVhYjgtNmFhMC00MTU2LWE0ZjYtYjlmMzJjNmVlYmZh
```

この値は既に`.env.local`に設定されています。

### 🔐 1.3 Google OAuth設定（まだ取得していない場合）

**今は空欄のままでOKです。** 後でGoogle Cloud Consoleで取得して設定します。

**設定が必要な値:**
- `GOOGLE_CLIENT_ID` - Google Cloud Consoleで取得
- `GOOGLE_CLIENT_SECRET` - Google Cloud Consoleで取得

詳細は [BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md#ステップ6-google-cloud-consoleの設定) を参照してください。

### 📊 1.4 Google Spreadsheet設定

**設定が必要な値:**
- `SPREADSHEET_ID` - Google SpreadsheetのID（後で取得します）
- `GOOGLE_APPLICATION_CREDENTIALS` - 既に設定済み（`./service-account.json`）

---

## ✅ ステップ2: Google Spreadsheetの準備

### 📁 2.1 ExcelテンプレートをGoogle Spreadsheetにインポート

#### 方法A: Google Drive経由（推奨・簡単）

1. **Google Driveにアクセス**
   - ブラウザで [https://drive.google.com/](https://drive.google.com/) を開く
   - Googleアカウントでログイン

2. **Excelファイルをアップロード**
   - 左上の「新規」ボタンをクリック
   - 「ファイルをアップロード」を選択
   - プロジェクトフォルダにある `template_DB.xlsx` を選択してアップロード

3. **Google Sheetsで開く**
   - アップロードしたExcelファイルを**右クリック**
   - 「アプリで開く」→「Google スプレッドシート」を選択
   - 自動的にGoogle Spreadsheet形式に変換されます

4. **名前を変更（オプション）**
   - 「ファイル」→「名前を変更」で適切な名前に変更（例: `在庫管理システム`）

#### 方法B: Google Sheetsから直接インポート

1. [Google Sheets](https://sheets.google.com/)にアクセス
2. 「空白」をクリックして新しいスプレッドシートを作成
3. 「ファイル」→「インポート」をクリック
4. 「アップロード」タブを選択
5. `template_DB.xlsx` ファイルをドラッグ&ドロップ
6. インポート設定:
   - **インポート場所**: 「新しいスプレッドシートを作成」を選択
   - **変換**: 「Google スプレッドシートに変換」を選択
7. 「データをインポート」をクリック

### 📋 2.2 シート名の確認

Google Spreadsheetを開いて、**下部のタブ**で以下のシートが含まれているか確認してください：

- ✅ `products`（商品マスタ）
- ✅ `inventory`（在庫）
- ✅ `orders`（受注）
- ✅ `sales`（売上）
- ✅ `users`（ユーザー権限）

**シート名が違う場合:**
- シートタブを**ダブルクリック**
- 正しい名前に変更
- 日本語名の場合は、英語名に変更してください

**例:**
- ❌ 「商品マスタ」→ ✅ `products`
- ❌ 「在庫」→ ✅ `inventory`

### 🔍 2.3 スプレッドシートIDの取得

1. **Google Spreadsheetを開く**
   - インポートしたスプレッドシートを開く

2. **URLを確認**
   - ブラウザのアドレスバーに表示されているURLを確認
   - URLの形式: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

3. **スプレッドシートIDをコピー**
   - `/d/`と`/edit`の間の文字列がスプレッドシートIDです

**例:**
```
URL: https://docs.google.com/spreadsheets/d/1ABC123xyz789/edit
                                    ↑この部分↑
スプレッドシートID: 1ABC123xyz789
```

4. **`.env.local`に設定**
   - VSCodeで`.env.local`ファイルを開く
   - `SPREADSHEET_ID=your-spreadsheet-id` の部分を
   - `SPREADSHEET_ID=1ABC123xyz789` のように変更（実際のIDに置き換え）

**注意:** `=`の前後にスペースを入れないでください。

### 👤 2.4 サービスアカウントに共有権限を付与

#### 2.4.1 サービスアカウントのメールアドレスを確認

1. **`service-account.json`ファイルを確認**
   - プロジェクトフォルダに `service-account.json` ファイルがあるか確認
   - **ない場合:** Google Cloud Consoleで作成する必要があります
     - 詳細: [BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md#64-サービスアカウントの作成データベース用)

2. **`client_email`の値をコピー**
   - `service-account.json`ファイルを開く（VSCodeで開けます）
   - 以下のような行を見つけます:
     ```json
     "client_email": "inventory-control@project-id.iam.gserviceaccount.com"
     ```
   - メールアドレスの部分（`inventory-control@project-id.iam.gserviceaccount.com`）をコピー

#### 2.4.2 スプレッドシートに共有権限を付与

1. **Google Spreadsheetを開く**
   - インポートしたスプレッドシートを開く

2. **「共有」ボタンをクリック**
   - 右上の「共有」ボタンをクリック

3. **サービスアカウントを追加**
   - 「ユーザーやグループを追加」欄に、コピーしたメールアドレスを貼り付け
   - 権限を「**編集者**」に設定
   - 「送信」をクリック（通知は送信しないでOK）

4. **共有権限の確認**
   - 共有設定で、サービスアカウントが「編集者」として表示されていることを確認

---

## ✅ ステップ3: 動作確認

### 🚀 3.1 開発サーバーの起動

1. **VSCodeのターミナルを開く**
   - VSCodeで「ターミナル」→「新しいターミナル」をクリック
   - または、キーボードショートカット：`Ctrl + Shift + ``（バッククォート）

2. **開発サーバーを起動**
   ```powershell
   npm run dev
   ```

3. **起動を待つ**
   - `- Local: http://localhost:3000` と表示されるまで待ちます（数十秒）
   - エラーが表示された場合は、エラーメッセージを確認してください

### 🧪 3.2 テストAPIにアクセス

#### テスト1: Spreadsheet接続テスト

**ブラウザで以下のURLにアクセス:**
```
http://localhost:3000/api/test-sheets?sheet=products
```

**期待される結果:**

✅ **正常な場合:**
```json
{
  "success": true,
  "message": "データの読み取りに成功しました",
  "data": {
    "sheetName": "products",
    "rows": [
      ["productId", "name", "barcode", "price", "category", "createdAt", "updatedAt"],
      ["PROD001", "テスト商品A", "1234567890123", "1000", "カテゴリ1", "2026-01-24", "2026-01-24"]
    ],
    "totalRows": 2,
    "headers": ["productId", "name", "barcode", "price", "category", "createdAt", "updatedAt"]
  }
}
```

❌ **エラーの場合:**
```json
{
  "success": false,
  "message": "データの読み取りに失敗しました",
  "error": "エラーメッセージが表示されます"
}
```

#### テスト2: 商品API（ログイン後）

1. **ログインページにアクセス**
   ```
   http://localhost:3000/login
   ```

2. **Googleでログイン**
   - 「Googleでログイン」ボタンをクリック
   - Googleアカウントでログイン
   - **注意:** Google OAuth設定がまだ完了していない場合は、このステップはスキップしてください

3. **商品APIにアクセス**
   ```
   http://localhost:3000/api/products
   ```

**期待される結果:**

✅ **正常な場合:**
```json
{
  "success": true,
  "data": [
    {
      "productId": "PROD001",
      "name": "テスト商品A",
      "barcode": "1234567890123",
      "price": 1000,
      "category": "カテゴリ1",
      "createdAt": "2026-01-24",
      "updatedAt": "2026-01-24"
    }
  ]
}
```

---

## 🐛 よくあるエラーと解決方法

### エラー1: `Permission denied` または `The caller does not have permission`

**原因:** サービスアカウントに共有権限が付与されていない

**解決方法:**
1. Google Spreadsheetを開く
2. 「共有」ボタンをクリック
3. サービスアカウントのメールアドレスが「編集者」として追加されているか確認
4. 追加されていない場合は、ステップ2.4を再度実行してください

### エラー2: `Spreadsheet not found` または `Unable to parse range`

**原因:** スプレッドシートIDが間違っている、またはシート名が間違っている

**解決方法:**
1. `.env.local`の`SPREADSHEET_ID`が正しいか確認
2. URLから正しくスプレッドシートIDをコピーしてください
3. シート名が `products`, `inventory`, `orders`, `sales`, `users` になっているか確認

### エラー3: `Cannot find module 'service-account.json'`

**原因:** `service-account.json`ファイルがプロジェクトフォルダにない

**解決方法:**
1. Google Cloud ConsoleでサービスアカウントのJSONキーをダウンロード
2. プロジェクトフォルダ（`Inventory_Control_2`）に `service-account.json` として保存
3. 詳細: [BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md#64-サービスアカウントの作成データベース用)

### エラー4: `Unauthorized`（商品APIで）

**原因:** ログインしていない、またはGoogle OAuth設定が完了していない

**解決方法:**
1. ログインページ（`http://localhost:3000/login`）にアクセス
2. Google OAuth設定が完了しているか確認
3. まだ設定していない場合は、[BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md#ステップ6-google-cloud-consoleの設定) を参照してください

---

## 📋 チェックリスト

設定が完了したら、以下を確認してください：

### 環境変数
- [ ] `.env.local`ファイルが作成された
- [ ] `NEXTAUTH_SECRET`が設定された（✅ 既に設定済み）
- [ ] `SPREADSHEET_ID`が設定された
- [ ] `GOOGLE_APPLICATION_CREDENTIALS=./service-account.json`が設定されている（✅ 既に設定済み）

### Google Spreadsheet
- [ ] ExcelファイルがGoogle Spreadsheetにインポートされた
- [ ] すべてのシート名が正しい（`products`, `inventory`, `orders`, `sales`, `users`）
- [ ] スプレッドシートIDが取得できた
- [ ] サービスアカウントに共有権限が付与された

### サービスアカウント
- [ ] `service-account.json`ファイルがプロジェクトフォルダにある
- [ ] サービスアカウントのメールアドレスが確認できた

### 動作確認
- [ ] 開発サーバーが起動する（`npm run dev`）
- [ ] テストAPIにアクセスできる（`http://localhost:3000/api/test-sheets?sheet=products`）
- [ ] データが正しく表示される

---

## 🎉 次のステップ

設定が完了したら、以下の機能を実装できます：

1. **受注管理機能** - 注文の作成・管理
2. **売上管理機能** - 売上データの確認・分析
3. **バーコードスキャン機能** - カメラでバーコードを読み取る
4. **ダッシュボード表示** - 売上グラフや在庫状況の可視化

---

**質問や問題がある場合は、エラーメッセージをコピーして、[SETUP_GUIDE.md](./SETUP_GUIDE.md) または [DEPENDENCY_ANALYSIS.md](./DEPENDENCY_ANALYSIS.md) のトラブルシューティングセクションを確認してください。**
