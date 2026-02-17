# ✅ Google OAuth設定の確認ガイド

このガイドでは、Google OAuth設定が正しく完了しているか確認する方法を説明します。

---

## 📋 設定確認チェックリスト

### ✅ 1. 環境変数の設定確認

`.env.local`ファイルに以下が設定されているか確認：

- [x] `GOOGLE_CLIENT_ID` - 設定済み ✅
- [x] `GOOGLE_CLIENT_SECRET` - 設定済み ✅
- [x] `NEXTAUTH_SECRET` - 設定済み ✅
- [x] `NEXTAUTH_URL` - 設定済み ✅

**現在の設定:**
```env
GOOGLE_CLIENT_ID=あなたのクライアントID.apps.googleusercontent.com ✅
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxx ✅
NEXTAUTH_SECRET=あなたの秘密鍵 ✅
NEXTAUTH_URL=http://localhost:3000 ✅
```
> ⚠️ **重要**: 実際の値は `.env.local` にのみ保存し、このドキュメントには記載しないでください。GitHub にプッシュするとシークレットスキャンで検出され、プッシュが拒否されます。

### ✅ 2. 設定値の形式確認

**GOOGLE_CLIENT_ID:**
- ✅ 形式: `数字-文字列.apps.googleusercontent.com`
- ✅ 形式が正しい

**GOOGLE_CLIENT_SECRET:**
- ✅ 形式: `GOCSPX-文字列`
- ✅ 形式が正しい

---

## 🧪 動作確認手順

### ステップ1: 開発サーバーの起動

1. **VSCodeのターミナルを開く**
   - 「ターミナル」→「新しいターミナル」

2. **開発サーバーを起動**
   ```powershell
   npm run dev
   ```

3. **起動を待つ**
   - `- Local: http://localhost:3000` と表示されるまで待つ

### ステップ2: ログインページにアクセス

1. **ブラウザでログインページを開く**
   ```
   http://localhost:3000/login
   ```

2. **ログインページが表示されることを確認**
   - 「在庫管理システム」というタイトルが表示される
   - 「Googleでログイン」ボタンが表示される

### ステップ3: Googleログインを試す

1. **「Googleでログイン」ボタンをクリック**

2. **期待される動作:**
   - ✅ Google認証画面にリダイレクトされる
   - ✅ Googleアカウントの選択画面が表示される
   - ✅ ログイン後、ホームページ（`http://localhost:3000`）にリダイレクトされる

3. **エラーが発生した場合:**
   - エラーメッセージを確認
   - よくあるエラーと解決方法を参照

---

## 🐛 よくあるエラーと解決方法

### エラー1: `redirect_uri_mismatch`

**エラーメッセージ:**
```
Error 400: redirect_uri_mismatch
```

**原因:** Google Cloud Consoleで設定したリダイレクトURIが正しくない

**解決方法:**
1. Google Cloud Consoleにアクセス
2. 「APIとサービス」→「認証情報」を開く
3. OAuth 2.0クライアントIDをクリック
4. 「承認済みのリダイレクトURI」に以下が追加されているか確認:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
5. 追加されていない場合は、追加してください

### エラー2: `invalid_client`

**エラーメッセージ:**
```
Error 401: invalid_client
```

**原因:** クライアントIDまたはシークレットが間違っている

**解決方法:**
1. `.env.local`の`GOOGLE_CLIENT_ID`と`GOOGLE_CLIENT_SECRET`が正しいか確認
2. Google Cloud Consoleで、正しい値をコピーして再度設定
3. 開発サーバーを再起動（`.env.local`の変更は再起動が必要）

### エラー3: `access_denied`

**エラーメッセージ:**
```
Error 403: access_denied
```

**原因:** OAuth同意画面の設定が完了していない

**解決方法:**
1. Google Cloud Consoleにアクセス
2. 「APIとサービス」→「OAuth同意画面」を開く
3. OAuth同意画面の設定が完了しているか確認
4. テストユーザーを追加する必要がある場合があります

---

## ✅ 正常に動作している場合の確認ポイント

### 1. ログインページ
- ✅ ログインページが表示される
- ✅ 「Googleでログイン」ボタンが表示される

### 2. Google認証
- ✅ 「Googleでログイン」ボタンをクリックすると、Google認証画面にリダイレクトされる
- ✅ Googleアカウントの選択画面が表示される
- ✅ アカウントを選択すると、認証が完了する

### 3. ログイン後
- ✅ ホームページ（`http://localhost:3000`）にリダイレクトされる
- ✅ ユーザー名またはメールアドレスが表示される
- ✅ 「ログアウト」ボタンが表示される

### 4. セッション管理
- ✅ ページをリロードしてもログイン状態が維持される
- ✅ 「ログアウト」ボタンをクリックすると、ログインページに戻る

---

## 🔍 詳細な動作確認

### APIエンドポイントの確認

1. **認証エンドポイント**
   ```
   http://localhost:3000/api/auth/signin
   ```
   - Googleログインボタンが表示される

2. **セッション確認（ログイン後）**
   ```
   http://localhost:3000/api/auth/session
   ```
   - ログインしている場合: セッション情報がJSONで表示される
   - ログインしていない場合: `{}` が表示される

---

## 📋 最終確認チェックリスト

- [ ] `.env.local`に`GOOGLE_CLIENT_ID`が設定されている ✅
- [ ] `.env.local`に`GOOGLE_CLIENT_SECRET`が設定されている ✅
- [ ] `.env.local`に`NEXTAUTH_SECRET`が設定されている ✅
- [ ] `.env.local`に`NEXTAUTH_URL`が設定されている ✅
- [ ] 開発サーバーが起動する
- [ ] ログインページが表示される
- [ ] 「Googleでログイン」ボタンが表示される
- [ ] Google認証画面にリダイレクトされる
- [ ] ログインが成功する
- [ ] ホームページにリダイレクトされる

---

## 🎉 設定完了！

すべてのチェック項目が完了したら、Google OAuth設定は正常に完了しています。

次のステップ:
1. Google Spreadsheetの準備
2. サービスアカウントの設定
3. 動作確認

---

**問題が発生した場合は、エラーメッセージをコピーして、[DEPENDENCY_ANALYSIS.md](./DEPENDENCY_ANALYSIS.md) のトラブルシューティングセクションを確認してください。**
