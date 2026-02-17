# 📋 環境設定ガイド

このガイドでは、在庫管理システムを動作させるために必要な環境設定を**ステップバイステップ**で説明します。

---

## 🎯 このガイドで行うこと

1. **環境変数ファイル（`.env.local`）の作成**
2. **Google Spreadsheetの準備**
3. **動作確認**

---

## 📝 ステップ1: 環境変数ファイルの作成

### 1.1 `.env.local`ファイルを作成

プロジェクトフォルダ（`Inventory_Control_2`）に `.env.local` という名前のファイルを作成します。

**VSCodeで作成する方法:**
1. VSCodeでプロジェクトフォルダを開く
2. 左側のファイル一覧で、プロジェクトフォルダ（`Inventory_Control_2`）を右クリック
3. 「新しいファイル」を選択
4. `.env.local` と入力してEnterキーを押す

**注意:** ファイル名の最初に `.`（ピリオド）が付きます。

### 1.2 環境変数を設定

`.env.local` ファイルに以下の内容をコピー＆ペーストしてください：

```env
# NextAuth設定
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=ここに秘密鍵を入力

# Google OAuth設定（Google Cloud Consoleで取得）
GOOGLE_CLIENT_ID=ここにクライアントIDを入力
GOOGLE_CLIENT_SECRET=ここにクライアントシークレットを入力

# Google Spreadsheet設定
SPREADSHEET_ID=ここにスプレッドシートIDを入力
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
```

### 1.3 NEXTAUTH_SECRETの生成

**PowerShellで実行:**
```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString()))
```

**コマンドプロンプトで実行:**
```cmd
powershell -Command "[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString()))"
```

表示された文字列をコピーして、`.env.local`の`NEXTAUTH_SECRET=`の後に貼り付けます。

**例:**
```env
NEXTAUTH_SECRET=Y2Q4ZjEyMzQ1NjdhOGI5YzAxMjM0NTY3ODkwYWJjZGU=
```

### 1.4 Google OAuth設定（まだ取得していない場合）

Google Cloud Consoleで取得する必要があります。詳細は [BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md#ステップ6-google-cloud-consoleの設定) を参照してください。

**今は空欄のままでOKです。** 後で設定できます。

---

## 📊 ステップ2: Google Spreadsheetの準備

### 2.1 ExcelテンプレートをGoogle Spreadsheetにインポート

#### 方法1: Google Drive経由（推奨）

1. **Google Driveにアクセス**
   - ブラウザで [https://drive.google.com/](https://drive.google.com/) を開く
   - Googleアカウントでログイン

2. **Excelファイルをアップロード**
   - 左上の「新規」ボタンをクリック
   - 「ファイルをアップロード」を選択
   - `template_DB.xlsx` ファイルを選択してアップロード

3. **Google Sheetsで開く**
   - アップロードしたExcelファイルを右クリック
   - 「アプリで開く」→「Google スプレッドシート」を選択
   - または、ファイルをダブルクリックして開く

4. **Google Spreadsheetとして保存**
   - ファイルが自動的にGoogle Spreadsheet形式に変換されます
   - 「ファイル」→「名前を変更」で適切な名前に変更（例: `在庫管理システム`）

#### 方法2: Google Sheetsから直接インポート

1. [Google Sheets](https://sheets.google.com/)にアクセス
2. 「空白」をクリックして新しいスプレッドシートを作成
3. 「ファイル」→「インポート」をクリック
4. 「アップロード」タブを選択
5. `template_DB.xlsx` ファイルをドラッグ&ドロップ
6. インポート設定:
   - **インポート場所**: 「新しいスプレッドシートを作成」を選択
   - **変換**: 「Google スプレッドシートに変換」を選択
7. 「データをインポート」をクリック

### 2.2 シート名の確認

Google Spreadsheetを開いて、以下のシートが含まれているか確認してください：

- ✅ `products`（商品マスタ）
- ✅ `inventory`（在庫）
- ✅ `orders`（受注）
- ✅ `sales`（売上）
- ✅ `users`（ユーザー権限）

**シート名が違う場合:**
- シートタブをダブルクリック
- 正しい名前に変更

### 2.3 スプレッドシートIDの取得

1. **Google Spreadsheetを開く**
2. **URLを確認**
   - ブラウザのアドレスバーに表示されているURLを確認
   - URLの形式: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - `/d/`と`/edit`の間の文字列がスプレッドシートIDです

**例:**
```
URL: https://docs.google.com/spreadsheets/d/1ABC123xyz789/edit
スプレッドシートID: 1ABC123xyz789
```

3. **`.env.local`に設定**
   - `.env.local`ファイルを開く
   - `SPREADSHEET_ID=` の後に、取得したスプレッドシートIDを貼り付け

**例:**
```env
SPREADSHEET_ID=1ABC123xyz789
```

### 2.4 サービスアカウントに共有権限を付与

#### 2.4.1 サービスアカウントのメールアドレスを確認

1. **`service-account.json`ファイルを開く**
   - プロジェクトフォルダに `service-account.json` ファイルがあるか確認
   - ない場合は、Google Cloud Consoleで作成する必要があります（[BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md#64-サービスアカウントの作成データベース用) を参照）

2. **`client_email`の値をコピー**
   - `service-account.json`ファイルを開く
   - `"client_email": "inventory-control@project-id.iam.gserviceaccount.com"` の部分をコピー
   - メールアドレスの部分（`inventory-control@project-id.iam.gserviceaccount.com`）をコピー

#### 2.4.2 スプレッドシートに共有権限を付与

1. **Google Spreadsheetを開く**
2. **「共有」ボタンをクリック**
   - 右上の「共有」ボタンをクリック
3. **サービスアカウントを追加**
   - 「ユーザーやグループを追加」欄に、コピーしたメールアドレスを貼り付け
   - 権限を「編集者」に設定
   - 「送信」をクリック（通知は送信しないでOK）

4. **共有権限の確認**
   - 共有設定で、サービスアカウントが「編集者」として表示されていることを確認

---

## ✅ ステップ3: 動作確認

### 3.1 開発サーバーの起動

1. **VSCodeのターミナルを開く**
   - VSCodeで「ターミナル」→「新しいターミナル」をクリック
   - または、キーボードショートカット：`Ctrl + Shift + ``（バッククォート）

2. **開発サーバーを起動**
   ```powershell
   npm run dev
   ```

3. **起動を待つ**
   - `- Local: http://localhost:3000` と表示されるまで待ちます（数十秒）

### 3.2 テストAPIにアクセス

#### テスト1: Spreadsheet接続テスト

ブラウザで以下のURLにアクセス：
```
http://localhost:3000/api/test-sheets?sheet=products
```

**期待される結果:**
- 正常な場合: JSON形式でデータが表示される
- エラーの場合: エラーメッセージが表示される

**正常なレスポンス例:**
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

#### テスト2: 商品API（ログイン後）

1. **ログインページにアクセス**
   ```
   http://localhost:3000/login
   ```

2. **Googleでログイン**
   - 「Googleでログイン」ボタンをクリック
   - Googleアカウントでログイン

3. **商品APIにアクセス**
   ```
   http://localhost:3000/api/products
   ```

**期待される結果:**
- 正常な場合: JSON形式で商品データが表示される
- エラーの場合: エラーメッセージが表示される

---

## 🐛 よくあるエラーと解決方法

### エラー1: `Permission denied`

**原因:** サービスアカウントに共有権限が付与されていない

**解決方法:**
- ステップ2.4を確認して、サービスアカウントに「編集者」権限を付与してください

### エラー2: `Spreadsheet not found`

**原因:** スプレッドシートIDが間違っている

**解決方法:**
- `.env.local`の`SPREADSHEET_ID`が正しいか確認してください
- URLから正しくスプレッドシートIDをコピーしてください

### エラー3: `Unable to parse range`

**原因:** シート名が間違っている

**解決方法:**
- Google Spreadsheetでシート名が `products`, `inventory`, `orders`, `sales`, `users` になっているか確認してください

### エラー4: `Cannot find module 'service-account.json'`

**原因:** `service-account.json`ファイルがプロジェクトフォルダにない

**解決方法:**
- Google Cloud ConsoleでサービスアカウントのJSONキーをダウンロード
- プロジェクトフォルダ（`Inventory_Control_2`）に `service-account.json` として保存

---

## 📋 チェックリスト

設定が完了したら、以下を確認してください：

- [ ] `.env.local`ファイルが作成された
- [ ] `NEXTAUTH_SECRET`が設定された
- [ ] `SPREADSHEET_ID`が設定された
- [ ] `service-account.json`ファイルがプロジェクトフォルダにある
- [ ] ExcelファイルがGoogle Spreadsheetにインポートされた
- [ ] すべてのシート名が正しい（`products`, `inventory`, `orders`, `sales`, `users`）
- [ ] サービスアカウントに共有権限が付与された
- [ ] 開発サーバーが起動する
- [ ] テストAPIにアクセスできる

---

## 🎉 次のステップ

設定が完了したら、以下の機能を実装できます：

1. **受注管理機能**
2. **売上管理機能**
3. **バーコードスキャン機能**
4. **ダッシュボード表示**

---

**質問や問題がある場合は、エラーメッセージをコピーして、[DEPENDENCY_ANALYSIS.md](./DEPENDENCY_ANALYSIS.md) のトラブルシューティングセクションを確認してください。**
