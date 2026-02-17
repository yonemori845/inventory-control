# GitHub シークレットスキャン エラー対処ガイド

## 発生したエラー

```
push declined due to repository rule violations
```

GitHub のシークレットスキャンが、コード内の**機密情報**（APIキー、パスワードなど）を検出し、プッシュを拒否しました。

---

## 実施した修正

1. **`docs/OAUTH_VERIFICATION.md`** から実際の機密情報を削除し、プレースホルダーに置き換えました
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`

2. **`.gitignore`** に `.npm` を追加し、npm のログなどがコミットされないようにしました

3. **コミットを修正**（amend）し、上記の変更を含めました

---

## 次のステップ

次のコマンドで再度プッシュしてください。

```bash
git push -u origin main
```

---

## 今後気をつけること

- **`.env.local`** と **`service-account.json`** は `.gitignore` に含まれているため、コミットされません
- ドキュメントやサンプルコードには、**実際の値ではなくプレースホルダー**（`your-google-client-id` など）を記載してください
- 誤って機密情報をコミットした場合は、すぐにその値を**無効化・再発行**してください（GitHub に一度でもプッシュされると、履歴に残ります）
