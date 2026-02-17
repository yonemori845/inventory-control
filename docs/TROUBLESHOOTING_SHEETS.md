# 🔧 Google Spreadsheet接続トラブルシューティング

このガイドでは、Google Spreadsheetへの接続がうまくいかない場合の原因と解決方法を詳しく説明します。

---

## 🔍 確認すべき項目

### 1. サービスアカウントの共有権限

**最も多い原因です！**

#### 確認方法

1. **サービスアカウントのメールアドレスを確認**
   - `service-account.json`ファイルを開く
   - `client_email`の値を確認
   - 例: `inventory-service@absolute-origin-484912-c5.iam.gserviceaccount.com`

2. **Google Spreadsheetで共有権限を確認**
   - Google Spreadsheetを開く
   - 右上の「共有」ボタンをクリック
   - サービスアカウントのメールアドレスが「編集者」として追加されているか確認

#### 解決方法

サービスアカウントが追加されていない場合：

1. **Google Spreadsheetを開く**
2. **「共有」ボタンをクリック**
3. **サービスアカウントのメールアドレスを追加**
   - 「ユーザーやグループを追加」欄に、`service-account.json`の`client_email`の値を貼り付け
   - 権限を「**編集者**」に設定
   - 「送信」をクリック

**現在のサービスアカウントメールアドレス:**
```
inventory-service@absolute-origin-484912-c5.iam.gserviceaccount.com
```

---

### 2. スプレッドシートIDの確認

#### 確認方法

1. **`.env.local`の`SPREADSHEET_ID`を確認**
   - 現在の設定: `1msoFzixbamiuh2MgC8vy55alOKNq_ejbFV_9K1Cz1Dw`

2. **Google SpreadsheetのURLと一致しているか確認**
   - Google Spreadsheetを開く
   - URLを確認: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - `/d/`と`/edit`の間の文字列がスプレッドシートIDです

#### 解決方法

スプレッドシートIDが間違っている場合：

1. Google SpreadsheetのURLから正しいIDをコピー
2. `.env.local`の`SPREADSHEET_ID`を更新
3. 開発サーバーを再起動

---

### 3. シート名の確認

#### 確認方法

1. **Google Spreadsheetを開く**
2. **下部のタブでシート名を確認**
   - 以下のシートが存在するか確認:
     - `products`
     - `inventory`
     - `orders`
     - `sales`
     - `users`

#### 解決方法

シート名が違う場合：

1. シートタブをダブルクリック
2. 正しい名前に変更
3. 日本語名の場合は、英語名に変更

---

### 4. API有効化の確認

#### 確認方法

1. **Google Cloud Consoleにアクセス**
   - [https://console.cloud.google.com/](https://console.cloud.google.com/)
   - プロジェクト `absolute-origin-484912-c5` を選択

2. **「APIとサービス」→「有効なAPI」をクリック**
3. **以下のAPIが表示されているか確認:**
   - ✅ Google Sheets API
   - ✅ Google Drive API（推奨）

#### 解決方法

APIが有効化されていない場合：

1. 「APIとサービス」→「ライブラリ」をクリック
2. 「Google Sheets API」を検索
3. 「有効にする」ボタンをクリック
4. 数分待ってから再度試す

---

### 5. サービスアカウントJSONファイルの確認

#### 確認方法

1. **`service-account.json`ファイルが存在するか確認**
   - プロジェクトフォルダ（`Inventory_Control_2`）に `service-account.json` があるか確認

2. **ファイルの内容が正しいか確認**
   - JSON形式が正しいか確認
   - `client_email`が含まれているか確認

#### 解決方法

ファイルが存在しない、または内容が正しくない場合：

1. Google Cloud ConsoleでサービスアカウントのJSONキーを再ダウンロード
2. プロジェクトフォルダに `service-account.json` として保存

---

## 🧪 詳細なエラーログの確認

テストAPIを改善しました。以下のURLにアクセスすると、より詳細なエラー情報が表示されます：

```
http://localhost:3000/api/test-sheets?sheet=products
```

### エラーの種類と対処法

#### エラー1: `SPREADSHEET_ACCESS_ERROR`

**原因:** サービスアカウントに共有権限が付与されていない

**解決方法:**
- ステップ1を参照して、サービスアカウントに共有権限を付与してください

#### エラー2: `Sheet "products" not found`

**原因:** シート名が間違っている

**解決方法:**
- エラーメッセージに「利用可能なシート名」が表示されます
- そのシート名を使用するか、Google Spreadsheetでシート名を変更してください

#### エラー3: `Permission denied`

**原因:** サービスアカウントの権限が不足している

**解決方法:**
- サービスアカウントに「編集者」権限が付与されているか確認
- Google Cloud Consoleで、サービスアカウントのロールが「エディター」になっているか確認

---

## 📋 確認チェックリスト

以下の項目を順番に確認してください：

- [ ] サービスアカウントのメールアドレスを確認した
- [ ] Google Spreadsheetにサービスアカウントが「編集者」として追加されている
- [ ] スプレッドシートIDが正しい
- [ ] シート名が正しい（`products`, `inventory`, `orders`, `sales`, `users`）
- [ ] Google Sheets APIが有効化されている
- [ ] Google Drive APIが有効化されている（推奨）
- [ ] `service-account.json`ファイルがプロジェクトフォルダにある
- [ ] `.env.local`の`GOOGLE_APPLICATION_CREDENTIALS=./service-account.json`が設定されている
- [ ] 開発サーバーを再起動した

---

## 🔧 デバッグ用の詳細確認API

以下のAPIにアクセスすると、スプレッドシートの情報が表示されます：

```
http://localhost:3000/api/test-sheets?sheet=products
```

**正常な場合のレスポンス:**
```json
{
  "success": true,
  "message": "データの読み取りに成功しました",
  "data": {
    "spreadsheetTitle": "スプレッドシートの名前",
    "sheetName": "products",
    "rows": [...],
    "totalRows": 2,
    "headers": ["productId", "name", "barcode", ...],
    "availableSheets": ["products", "inventory", "orders", "sales", "users"]
  }
}
```

**エラーの場合のレスポンス:**
```json
{
  "success": false,
  "message": "エラーメッセージ",
  "error": "詳細なエラーメッセージ",
  "details": {
    "spreadsheetId": "...",
    "sheetName": "products",
    "errorType": "エラーの種類",
    "hint": "解決方法のヒント"
  }
}
```

---

## 🎯 最も可能性の高い原因

**サービスアカウントに共有権限が付与されていない**ことが最も多い原因です。

**確認手順:**
1. `service-account.json`の`client_email`を確認
   - 現在の値: `inventory-service@absolute-origin-484912-c5.iam.gserviceaccount.com`
2. Google Spreadsheetの「共有」設定で、このメールアドレスが「編集者」として追加されているか確認
3. 追加されていない場合は、追加してください

---

## 📞 さらなるサポート

上記の手順を試しても解決しない場合：

1. **エラーメッセージをコピー**
   - `http://localhost:3000/api/test-sheets?sheet=products` にアクセス
   - 表示されたエラーメッセージをコピー

2. **確認した項目をリストアップ**
   - 上記のチェックリストで確認した項目をリストアップ

3. **エラーメッセージと確認した項目を共有**
   - より具体的な解決方法を提案できます

---

**まずは、サービスアカウントの共有権限を確認してください！**
