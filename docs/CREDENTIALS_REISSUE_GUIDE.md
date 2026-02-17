# 🔐 認証情報の再発行ガイド

シークレットが漏洩した可能性がある場合に、認証情報を再発行する手順です。

---

## 1. Google OAuth クライアントのシークレットを再発行する

### ステップ1：Google Cloud Console を開く

1. [https://console.cloud.google.com](https://console.cloud.google.com) にアクセス
2. このプロジェクトで使用している **Google Cloud プロジェクト** を選択（左上のプロジェクト名をクリック）

### ステップ2：認証情報画面を開く

1. 左メニュー **「☰」** → **「APIとサービス」** → **「認証情報」** をクリック

### ステップ3：OAuth クライアントを編集

1. **「OAuth 2.0 クライアント ID」** の一覧を表示
2. このアプリ用のクライアント（種類が「ウェブアプリケーション」のもの）の **名前** をクリック

### ステップ4：シークレットを再発行

1. **「クライアントシークレット」** の右側にある **「シークレットを再生成」** をクリック
2. 確認ダイアログで **「再生成」** をクリック
3. 表示された **新しいシークレット**（`GOCSPX-` で始まる文字列）をコピー
   - ⚠️ **この画面を閉じると二度と表示されません**。必ずコピーして安全な場所に保存してください

### ステップ5：.env.local を更新

1. プロジェクトフォルダの `.env.local` を開く
2. `GOOGLE_CLIENT_SECRET=` の後ろの値を、コピーした新しいシークレットに置き換える

```env
GOOGLE_CLIENT_SECRET=GOCSPX-新しいシークレットをここに貼り付け
```

3. ファイルを保存

---

## 2. NEXTAUTH_SECRET を新しく生成する

### ステップ1：新しいシークレットを生成

ターミナル（コマンドプロンプト）で、次のいずれかの方法でランダムな文字列を生成します。

#### 方法A：OpenSSL を使う（推奨）

```bash
openssl rand -base64 32
```

表示された文字列（例：`Y2Q4ZjEyMzQ1NjdhOGI5YzAxMjM0NTY3ODkwYWJjZGU=`）をコピーします。

#### 方法B：Node.js を使う

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

表示された文字列をコピーします。

#### 方法C：オンラインツールを使う

- [https://generate-secret.vercel.app/32](https://generate-secret.vercel.app/32) にアクセス
- 表示された文字列をコピー

### ステップ2：.env.local を更新

1. プロジェクトフォルダの `.env.local` を開く
2. `NEXTAUTH_SECRET=` の後ろの値を、生成した新しい文字列に置き換える

```env
NEXTAUTH_SECRET=ここに生成した文字列を貼り付け
```

3. ファイルを保存

---

## 3. 更新後の確認

### ローカルで動作確認

1. 開発サーバーを再起動
   ```bash
   npm run dev
   ```
2. ブラウザで `http://localhost:3000` を開く
3. **ログアウト**してから、もう一度 **ログイン** する
4. 正常にログインできることを確認

### Vercel にデプロイしている場合

1. Vercel のダッシュボード → プロジェクト → **「Settings」** → **「Environment Variables」**
2. 次の2つを更新：
   - `GOOGLE_CLIENT_SECRET`：新しい値に変更
   - `NEXTAUTH_SECRET`：新しい値に変更
3. **「Save」** をクリック
4. **「Deployments」** タブ → 最新のデプロイの **「⋯」** → **「Redeploy」** で再デプロイ

---

## 📌 まとめチェックリスト

- [ ] Google Cloud Console で OAuth クライアントのシークレットを再発行した
- [ ] 新しい `GOOGLE_CLIENT_SECRET` を `.env.local` に反映した
- [ ] 新しい `NEXTAUTH_SECRET` を生成した
- [ ] 新しい `NEXTAUTH_SECRET` を `.env.local` に反映した
- [ ] ローカルでログイン動作を確認した
- [ ] Vercel を使っている場合は、環境変数を更新して再デプロイした
