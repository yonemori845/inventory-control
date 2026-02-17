# 🔧 Google Sheets API有効化ガイド

このガイドでは、Google Sheets APIを有効化する方法を詳しく説明します。

---

## 🚨 エラーの内容

以下のエラーが表示された場合、Google Sheets APIが有効化されていません：

```
Google Sheets API has not been used in project 664178560143 before or it is disabled.
Enable it by visiting https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=664178560143
```

---

## ✅ 解決方法：Google Sheets APIを有効化する

### ステップ1: Google Cloud Consoleにアクセス

1. **ブラウザでGoogle Cloud Consoleを開く**
   - [https://console.cloud.google.com/](https://console.cloud.google.com/) にアクセス
   - Googleアカウントでログイン

2. **プロジェクトを選択**
   - 画面上部の「プロジェクトを選択」をクリック
   - プロジェクトID `664178560143` のプロジェクトを選択
   - または、エラーメッセージ内のリンクを直接クリック:
     ```
     https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=664178560143
     ```

---

### ステップ2: APIライブラリに移動

#### 方法A: エラーメッセージのリンクから（簡単）

1. **エラーメッセージ内のリンクをクリック**
   - ブラウザの開発者ツールで表示されたエラーメッセージ内のURLをクリック
   - または、以下のURLを直接ブラウザで開く:
     ```
     https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=664178560143
     ```

#### 方法B: メニューから移動

1. **左側のメニューから「APIとサービス」をクリック**
   - メニューが表示されていない場合は、左上の「☰」（ハンバーガーメニュー）をクリック

2. **「ライブラリ」をクリック**
   - 「APIとサービス」→「ライブラリ」の順にクリック

3. **検索ボックスに「Google Sheets API」と入力**
   - 検索結果から「Google Sheets API」をクリック

---

### ステップ3: Google Sheets APIを有効化

1. **「有効にする」ボタンをクリック**
   - Google Sheets APIのページが開きます
   - 上部に「有効にする」ボタンが表示されます
   - このボタンをクリック

2. **有効化を待つ**
   - 「APIを有効にしています...」というメッセージが表示されます
   - 数秒〜数十秒で有効化が完了します
   - 「APIが有効になりました」というメッセージが表示されます

---

### ステップ4: Google Drive APIも有効化（推奨）

Google Spreadsheetにアクセスするために、Google Drive APIも有効化することを推奨します。

1. **APIライブラリに戻る**
   - 左側のメニューから「APIとサービス」→「ライブラリ」をクリック

2. **検索ボックスに「Google Drive API」と入力**
   - 検索結果から「Google Drive API」をクリック

3. **「有効にする」ボタンをクリック**
   - 有効化が完了するまで待ちます

---

### ステップ5: 動作確認

1. **開発サーバーを再起動（必要に応じて）**
   ```powershell
   # 現在のサーバーを停止（Ctrl + C）
   # 再度起動
   npm run dev
   ```

2. **テストAPIにアクセス**
   ```
   http://localhost:3000/api/test-sheets?sheet=products
   ```

3. **期待される結果**
   - ✅ 正常な場合: JSON形式でデータが表示される
   - ❌ まだエラーが出る場合: 数分待ってから再度試してください（API有効化の反映に時間がかかることがあります）

---

## ⏱️ API有効化の反映時間

APIを有効化した後、反映までに**数分かかることがあります**。

- すぐに反映される場合: 数秒〜1分
- 反映に時間がかかる場合: 5分〜10分

エラーが続く場合は、少し時間をおいてから再度試してください。

---

## 🔍 確認方法

### APIが有効化されているか確認

1. **Google Cloud Consoleにアクセス**
2. **「APIとサービス」→「有効なAPI」をクリック**
3. **以下のAPIが表示されているか確認:**
   - ✅ Google Sheets API
   - ✅ Google Drive API（有効化した場合）

---

## 🐛 よくある問題

### 問題1: 「有効にする」ボタンが表示されない

**原因:** 既に有効化されている可能性があります

**解決方法:**
1. 「APIとサービス」→「有効なAPI」を確認
2. Google Sheets APIが表示されていれば、既に有効化されています
3. それでもエラーが出る場合は、数分待ってから再度試してください

### 問題2: 有効化後もエラーが続く

**原因:** API有効化の反映に時間がかかっている

**解決方法:**
1. 5分〜10分待ってから再度試してください
2. 開発サーバーを再起動してください
3. ブラウザのキャッシュをクリアしてください

### 問題3: プロジェクトが見つからない

**原因:** 間違ったプロジェクトを選択している

**解決方法:**
1. 画面上部の「プロジェクトを選択」で、正しいプロジェクトを選択
2. プロジェクトID `664178560143` のプロジェクトを選択してください

---

## 📋 チェックリスト

- [ ] Google Cloud Consoleにアクセスできた
- [ ] 正しいプロジェクトが選択されている
- [ ] Google Sheets APIが有効化された
- [ ] Google Drive APIが有効化された（推奨）
- [ ] 数分待った（API有効化の反映を待つ）
- [ ] 開発サーバーを再起動した
- [ ] テストAPIにアクセスして動作確認した

---

## 🎯 次のステップ

Google Sheets APIが有効化されたら：

1. **動作確認**
   - `http://localhost:3000/api/test-sheets?sheet=products` にアクセス
   - データが正しく表示されることを確認

2. **Google Spreadsheetの準備**
   - ExcelテンプレートをGoogle Spreadsheetにインポート
   - スプレッドシートIDを取得
   - `.env.local`に`SPREADSHEET_ID`を設定

3. **サービスアカウントの設定**
   - サービスアカウントに共有権限を付与

---

**質問や問題がある場合は、エラーメッセージをコピーして、[DEPENDENCY_ANALYSIS.md](./DEPENDENCY_ANALYSIS.md) のトラブルシューティングセクションを確認してください。**
