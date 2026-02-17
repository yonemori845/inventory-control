# 📤 Vercel デプロイ ステップバイステップガイド

このガイドでは、在庫注文管理システムを **Vercel** にデプロイし、**iPhone から HTTPS でアクセス**できるようにする手順を、初めての方でも分かるように説明します。

---

## 📋 目次

1. [事前準備](#1-事前準備)
2. [ステップ1：GitHub にコードをアップロードする](#2-ステップ1github-にコードをアップロードする)
3. [ステップ2：Vercel に登録する](#3-ステップ2vercel-に登録する)
4. [ステップ3：Vercel でプロジェクトを作成する](#4-ステップ3vercel-でプロジェクトを作成する)
5. [ステップ4：環境変数を設定する](#5-ステップ4環境変数を設定する)
6. [ステップ5：Google OAuth の設定を更新する](#6-ステップ5google-oauth-の設定を更新する)
7. [ステップ6：デプロイを確認する](#7-ステップ6デプロイを確認する)
8. [iPhone からアクセスする](#8-iphone-からアクセスする)

---

## 1. 事前準備

デプロイを始める前に、次のものが揃っているか確認してください。

| 項目 | 確認方法 |
|------|----------|
| **GitHub アカウント** | [github.com](https://github.com) でログインできること |
| **ローカルで動作している** | `npm run dev` でアプリが起動し、ログインやデータ表示ができること |
| **`.env.local` の内容** | 後で Vercel に設定するため、値が分かる状態にしておく |
| **`service-account.json`** | Google Cloud からダウンロードしたサービスアカウントの JSON ファイル |

---

## 2. ステップ1：GitHub にコードをアップロードする

Vercel は GitHub のリポジトリからコードを取得してデプロイします。まず、プロジェクトを GitHub にアップロードします。

### 2.1 GitHub で新しいリポジトリを作成

1. [https://github.com](https://github.com) にログイン
2. 右上の **「+」** → **「New repository」** をクリック
3. 次のように入力：
   - **Repository name**: `inventory-control`（任意の名前でOK）
   - **Public** を選択
   - **「Create repository」** をクリック

### 2.2 ローカルのプロジェクトを GitHub にプッシュ

プロジェクトフォルダ（`Inventory_Control_2`）で、ターミナル（コマンドプロンプト）を開き、次を実行します。

```bash
# まだ Git を初期化していない場合
git init

# すべてのファイルを追加（.gitignore で除外されたファイルは除く）
git add .

# 初回コミット
git commit -m "Initial commit"

# GitHub のリポジトリをリモートとして追加（URL は自分のリポジトリに合わせて変更）
git remote add origin https://github.com/あなたのユーザー名/inventory-control.git

# メインブランチをプッシュ
git branch -M main
git push -u origin main
```

> ⚠️ **注意**：`service-account.json` と `.env.local` は `.gitignore` に含まれているため、GitHub にはアップロードされません。これは意図した動作です（機密情報を守るため）。

---

## 3. ステップ2：Vercel に登録する

1. [https://vercel.com](https://vercel.com) にアクセス
2. **「Sign Up」** をクリック
3. **「Continue with GitHub」** を選択
4. GitHub の認証画面で **「Authorize Vercel」** をクリック
5. 必要に応じてプロフィール情報を入力し、**「Continue」**

---

## 4. ステップ3：Vercel でプロジェクトを作成する

1. Vercel のダッシュボードで **「Add New...」** → **「Project」** をクリック
2. **「Import Git Repository」** の一覧から、先ほどプッシュしたリポジトリ（例：`inventory-control`）を選択
3. **「Import」** をクリック
4. プロジェクト設定画面で：
   - **Framework Preset**: `Next.js` のまま（自動検出されているはず）
   - **Root Directory**: そのまま（`./`）
   - **Build and Output Settings**: そのままでOK
5. **「Environment Variables」** は、この段階ではまだ設定しません。次のステップで行います。
6. **「Deploy」** をクリック

> 最初のデプロイは環境変数なしで実行され、エラーになる可能性があります。次のステップで環境変数を設定し、再デプロイします。

---

## 5. ステップ4：環境変数を設定する

デプロイが完了したら（成功・失敗どちらでも）、プロジェクトの **「Settings」** から環境変数を設定します。

### 5.1 プロジェクトの設定画面を開く

1. デプロイ完了後の画面で、上部の **「Settings」** タブをクリック
2. 左メニューから **「Environment Variables」** をクリック

### 5.2 環境変数を1つずつ追加する

次の変数を、**1つずつ**追加します。各変数で **「Save」** を押してから次に進んでください。

#### ① NEXTAUTH_SECRET

| 項目 | 値 |
|------|-----|
| **Name** | `NEXTAUTH_SECRET` |
| **Value** | `.env.local` の `NEXTAUTH_SECRET` の値（そのままコピー） |
| **Environment** | Production, Preview, Development すべてにチェック |

#### ② NEXTAUTH_URL

| 項目 | 値 |
|------|-----|
| **Name** | `NEXTAUTH_URL` |
| **Value** | `https://あなたのプロジェクト名.vercel.app` |
| **Environment** | Production, Preview, Development すべてにチェック |

> 💡 **プロジェクト名の確認方法**：Vercel のプロジェクト画面の上部に表示されている URL（例：`inventory-control-xxx.vercel.app`）をそのまま使います。最初のデプロイ後に表示されます。

#### ③ GOOGLE_CLIENT_ID

| 項目 | 値 |
|------|-----|
| **Name** | `GOOGLE_CLIENT_ID` |
| **Value** | `.env.local` の `GOOGLE_CLIENT_ID` の値 |
| **Environment** | Production, Preview, Development すべてにチェック |

#### ④ GOOGLE_CLIENT_SECRET

| 項目 | 値 |
|------|-----|
| **Name** | `GOOGLE_CLIENT_SECRET` |
| **Value** | `.env.local` の `GOOGLE_CLIENT_SECRET` の値 |
| **Environment** | Production, Preview, Development すべてにチェック |

#### ⑤ SPREADSHEET_ID

| 項目 | 値 |
|------|-----|
| **Name** | `SPREADSHEET_ID` |
| **Value** | `.env.local` の `SPREADSHEET_ID` の値（スプレッドシートのURLの `/d/` と `/edit` の間の文字列） |
| **Environment** | Production, Preview, Development すべてにチェック |

#### ⑥ GOOGLE_SERVICE_ACCOUNT_JSON（重要）

Vercel では `service-account.json` ファイルをアップロードできないため、**JSON の中身をそのまま**環境変数に設定します。

1. パソコンで `service-account.json` を開く（メモ帳や VSCode でOK）
2. **ファイルの中身をすべてコピー**（`{` から `}` まで、改行も含めて）
3. Vercel の環境変数で：

| 項目 | 値 |
|------|-----|
| **Name** | `GOOGLE_SERVICE_ACCOUNT_JSON` |
| **Value** | コピーした JSON 全体を貼り付け |
| **Environment** | Production, Preview, Development すべてにチェック |

> ⚠️ **注意**：JSON は1行でも複数行でも構いません。`{ "type": "service_account", ... }` という形式のまま貼り付けてください。余計なスペースや改行を入れないように注意します。

### 5.3 設定の確認

次の6つがすべて登録されているか確認します。

- [ ] NEXTAUTH_SECRET
- [ ] NEXTAUTH_URL
- [ ] GOOGLE_CLIENT_ID
- [ ] GOOGLE_CLIENT_SECRET
- [ ] SPREADSHEET_ID
- [ ] GOOGLE_SERVICE_ACCOUNT_JSON

---

## 6. ステップ5：Google OAuth の設定を更新する

Vercel の URL からログインできるように、Google Cloud Console でリダイレクト URI を追加します。

### 6.1 Google Cloud Console を開く

1. [https://console.cloud.google.com](https://console.cloud.google.com) にアクセス
2. このプロジェクトで使っている **Google Cloud プロジェクト** を選択

### 6.2 OAuth 認証情報を編集

1. 左メニュー **「APIとサービス」** → **「認証情報」** をクリック
2. **「OAuth 2.0 クライアント ID」** の一覧から、このアプリ用のクライアント（「ウェブアプリケーション」など）をクリック
3. **「承認済みのリダイレクト URI」** の **「URI を追加」** をクリック
4. 次の形式で入力（`あなたのプロジェクト名` は Vercel の実際のURLに合わせる）：

   ```
   https://あなたのプロジェクト名.vercel.app/api/auth/callback/google
   ```

   例：`https://inventory-control-abc123.vercel.app/api/auth/callback/google`

5. **「保存」** をクリック

### 6.3 承認済みの JavaScript 生成元（必要な場合）

「承認済みの JavaScript 生成元」にも、次のURLを追加します。

```
https://あなたのプロジェクト名.vercel.app
```

---

## 7. ステップ6：デプロイを確認する

環境変数を設定したら、**再デプロイ**して反映させます。

### 7.1 再デプロイの実行

1. Vercel のプロジェクト画面で、上部の **「Deployments」** タブをクリック
2. 一番上のデプロイの右側の **「⋯」（3点メニュー）** をクリック
3. **「Redeploy」** を選択
4. **「Redeploy」** をクリック

### 7.2 デプロイの完了を待つ

1〜2分ほど待つと、ステータスが **「Ready」** になります。

### 7.3 動作確認

1. **「Visit」** ボタンをクリックするか、表示されている URL をクリック
2. アプリのトップページが表示されることを確認
3. **「ログイン」** をクリック
4. Google アカウントでログインできることを確認
5. ログイン後、商品一覧や在庫などが表示されることを確認

### エラーが出た場合

- **「Application error」** などが表示される場合：Vercel の **「Deployments」** → 該当デプロイ → **「Building」** や **「Functions」** のログを確認
- **ログインできない**場合：Google OAuth のリダイレクト URI が正しく追加されているか、もう一度確認
- **データが表示されない**場合：`GOOGLE_SERVICE_ACCOUNT_JSON` と `SPREADSHEET_ID` が正しく設定されているか確認。また、スプレッドシートにサービスアカウントのメールアドレスが共有されているか確認

---

## 8. iPhone からアクセスする

デプロイが成功したら、iPhone からアクセスできます。

### 8.1 URL を確認する

Vercel のプロジェクト画面に表示されている URL をメモします。

例：`https://inventory-control-abc123.vercel.app`

### 8.2 iPhone の Safari で開く

1. iPhone で **Safari** を開く
2. アドレスバーに URL を入力（またはブックマークから選択）
3. アプリのトップページが表示されることを確認
4. ログインして、バーコードスキャンなど必要な機能を試す

### 8.3 ホーム画面に追加（任意）

1. Safari でアプリのページを開いた状態で、画面下部の **「共有」** ボタンをタップ
2. **「ホーム画面に追加」** を選択
3. 名前を確認して **「追加」** をタップ

これで、アプリのように起動できるようになります。

---

## 📌 まとめチェックリスト

デプロイが完了したら、次を確認してください。

- [ ] GitHub にコードがプッシュされている
- [ ] Vercel にプロジェクトが作成されている
- [ ] 6つの環境変数がすべて設定されている
- [ ] Google OAuth のリダイレクト URI に Vercel の URL が追加されている
- [ ] 再デプロイが完了し、「Ready」になっている
- [ ] パソコンのブラウザでログインとデータ表示ができる
- [ ] iPhone の Safari から HTTPS の URL でアクセスできる
- [ ] iPhone でバーコードスキャンが動作する

---

## 🔧 よくあるトラブル

### デプロイは成功するが「Application error」が表示される

- **原因**：環境変数の設定ミス、特に `GOOGLE_SERVICE_ACCOUNT_JSON` の形式
- **対処**：JSON が正しい形式か確認。余計な文字が入っていないか、`{` と `}` が揃っているか確認

### ログインしようとするとエラーになる

- **原因**：Google OAuth のリダイレクト URI が未設定、または URL が間違っている
- **対処**：Google Cloud Console で、`https://あなたのURL.vercel.app/api/auth/callback/google` が正確に登録されているか確認

### ログインはできるがデータが表示されない

- **原因**：`GOOGLE_SERVICE_ACCOUNT_JSON` または `SPREADSHEET_ID` の設定ミス、またはスプレッドシートの共有設定
- **対処**：サービスアカウントのメールアドレスがスプレッドシートの「編集者」として共有されているか確認

---

不明な点があれば、プロジェクトのサポートやドキュメントを参照してください。
