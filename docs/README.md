# 在庫注文管理システム

Google Spreadsheetをデータベースとして使用する、PWA対応の在庫・受注・売上管理システムです。

## 📋 プロジェクト概要

### 主な機能
- ✅ Googleアカウントによるログイン認証
- ✅ バーコードスキャンによる商品登録・検索
- ✅ Google Spreadsheetとの連携によるデータ管理
- ✅ 在庫管理機能（数量管理、アラート）
- ✅ 受注管理機能（注文作成、ステータス管理）
- ✅ 売上管理機能（レポート、グラフ表示）
- ✅ ダッシュボードによる経営指標の可視化
- ✅ PWA対応（オフライン機能、インストール可能）

### 技術スタック
- **フロントエンド**: Next.js 14+ (App Router) + TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **認証**: NextAuth.js (Google OAuth)
- **データベース**: Google Spreadsheet API
- **バーコードスキャン**: @zxing/library
- **グラフ**: Recharts
- **状態管理**: Zustand + TanStack Query
- **PWA**: next-pwa
- **ホスティング**: Vercel

---

## 🚀 クイックスタート

### 初心者の方

**まずは [BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md) を読んでください。**  
分かりやすく丁寧に説明した完全ガイドです。

### 経験者の方

詳細な手順は [`QUICK_START.md`](./QUICK_START.md) を参照してください。

### 1. プロジェクト初期化
```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
npm install next-auth@beta googleapis @zxing/library recharts zustand @tanstack/react-query next-pwa
```

### 2. Google Cloud Console設定
- Google Sheets API有効化
- OAuth 2.0認証情報作成
- サービスアカウント作成

### 3. Google Spreadsheet準備
- Excelテンプレートからインポート（推奨）または手動でスプレッドシート作成
- シート構造設定
- サービスアカウントに共有権限付与

**注意:** Excelテンプレートファイルがある場合は、Google Drive経由でGoogle Spreadsheetにインポートできます。詳細は [`STEP_BY_STEP_GUIDE.md`](./STEP_BY_STEP_GUIDE.md) のステップ3.1を参照してください。

### 4. 環境変数設定
`.env.local`ファイルを作成し、必要な環境変数を設定

### 5. 開発サーバー起動
```bash
npm run dev
```

---

## 📁 プロジェクト構造

```
Inventory_Control_2/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 認証関連ページ
│   ├── (dashboard)/       # ダッシュボード
│   ├── inventory/         # 在庫管理
│   ├── orders/            # 受注管理
│   ├── sales/             # 売上管理
│   ├── products/          # 商品管理
│   └── api/               # API Routes
├── components/            # コンポーネント
│   ├── ui/               # UIコンポーネント
│   ├── barcode/          # バーコードスキャン
│   ├── charts/           # グラフコンポーネント
│   └── layout/           # レイアウトコンポーネント
├── lib/                  # ユーティリティ・ライブラリ
│   ├── google-sheets/    # Google Sheets API
│   ├── auth/             # 認証関連
│   └── utils/            # 汎用ユーティリティ
├── types/                # TypeScript型定義
├── hooks/                # カスタムフック
├── store/                # 状態管理（Zustand）
└── public/               # 静的ファイル
```

---

## 📚 ドキュメント

### 🎯 初心者の方へ

**プログラミング初心者や非エンジニアの方は、こちらから始めてください：**

- **[初心者向け開発ガイド](./BEGINNER_GUIDE.md)**: 分かりやすく丁寧に説明した完全ガイド（推奨）
- **[マスターチェックリスト](./MASTER_CHECKLIST.md)**: 全体の進捗を管理するチェックリスト

### 📖 経験者の方へ

- **[開発計画書](./DEVELOPMENT_PLAN.md)**: フェーズ別の開発計画とタスクリスト
- **[技術詳細](./TECHNICAL_DETAILS.md)**: 技術スタックの詳細と実装パターン
- **[クイックスタート](./QUICK_START.md)**: 開発開始までの手順とチェックリスト
- **[依存関係分析](./DEPENDENCY_ANALYSIS.md)**: 依存関係の互換性チェックと構築環境の問題解決
- **[ステップバイステップガイド](./STEP_BY_STEP_GUIDE.md)**: 詳細な実装手順

---

## 🗺️ 開発フェーズ

詳細は [`DEVELOPMENT_PLAN.md`](./DEVELOPMENT_PLAN.md) を参照してください。

1. **フェーズ1**: プロジェクト基盤構築
2. **フェーズ2**: 認証機能実装
3. **フェーズ3**: Google Spreadsheet連携
4. **フェーズ4**: 在庫管理機能
5. **フェーズ5**: 受注管理機能
6. **フェーズ6**: 売上管理機能
7. **フェーズ7**: ダッシュボード
8. **フェーズ8**: PWA対応
9. **フェーズ9**: レスポンシブ対応・UI改善
10. **フェーズ10**: テスト・デプロイ

---

## 🔑 環境変数

`.env.local`ファイルに以下の環境変数を設定してください：

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Google Spreadsheet
SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account-email
GOOGLE_PRIVATE_KEY=your-private-key
```

---

## 🛠️ 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm start

# リント
npm run lint

# 型チェック
npm run type-check
```

---

## 📊 Google Spreadsheet構造

### シート一覧
- **products**: 商品マスタ
- **inventory**: 在庫情報
- **orders**: 受注情報
- **sales**: 売上情報
- **users**: ユーザー権限

詳細な構造は [`TECHNICAL_DETAILS.md`](./TECHNICAL_DETAILS.md) を参照してください。

---

## 🚨 注意事項

### Google Sheets API制限
- 1分あたり60リクエスト（デフォルト）
- 1日あたり300リクエスト（無料枠）
- 大量データ処理時はバッチ処理を検討

### セキュリティ
- 環境変数の適切な管理
- 認証・認可の徹底
- 入力データのバリデーション

### パフォーマンス
- Spreadsheet APIの呼び出しを最小限に
- キャッシュを積極的に活用
- ページネーション実装

---

## 🐛 トラブルシューティング

- **[依存関係分析](./DEPENDENCY_ANALYSIS.md)**: 依存関係や構築環境の問題と解決方法
- **[クイックスタート](./QUICK_START.md)**: よくある問題と解決方法
- **[ステップバイステップガイド](./STEP_BY_STEP_GUIDE.md)**: 各ステップでのトラブルシューティング

**推奨アプローチ:**
1. まず [`STEP_BY_STEP_GUIDE.md`](./STEP_BY_STEP_GUIDE.md) に従ってステップバイステップで実装
2. 問題が発生したら [`DEPENDENCY_ANALYSIS.md`](./DEPENDENCY_ANALYSIS.md) を参照
3. それでも解決しない場合は [`QUICK_START.md`](./QUICK_START.md) のトラブルシューティングセクションを確認

---

## 📈 今後の拡張予定

- [ ] 決済機能（Stripe統合）
- [ ] 複数店舗対応
- [ ] 在庫予測機能
- [ ] メール通知機能
- [ ] レポート自動生成
- [ ] モバイルアプリ（React Native）

---

## 📝 ライセンス

このプロジェクトは学習目的で作成されています。

---

## 👥 貢献

プロジェクトへの貢献を歓迎します。IssueやPull Requestをお気軽に作成してください。

---

## 📞 サポート

質問や問題がある場合は、Issueを作成してください。
