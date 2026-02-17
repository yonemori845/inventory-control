# 在庫注文管理システム

Google Spreadsheetをデータベースとして使用する、PWA対応の在庫・受注・売上管理システムです。

## 📚 ドキュメント

すべてのドキュメントは [`docs`](./docs/) フォルダにあります。

### 🎯 まず読むべきドキュメント

- **[プロジェクト全体像](./docs/PROJECT_OVERVIEW.md)**: プロジェクトの全体像と開発計画の理解（推奨）
- **[マスターチェックリスト](./docs/MASTER_CHECKLIST.md)**: 全体の進捗を管理するチェックリスト

### 🎯 初心者の方へ

**プログラミング初心者や非エンジニアの方は、こちらから始めてください：**

- **[初心者向け開発ガイド](./docs/BEGINNER_GUIDE.md)**: 分かりやすく丁寧に説明した完全ガイド（推奨）
- **[マスターチェックリスト](./docs/MASTER_CHECKLIST.md)**: 全体の進捗を管理するチェックリスト

### 📱 バーコードスキャンの使い方

- **[バーコードスキャン 使い方ガイド](./docs/BARCODE_SCANNER_GUIDE.md)**: 初学者向け・丁寧な操作手順とトラブルシューティング

### 📤 Vercel へのデプロイ（iPhone で使う場合）

- **[Vercel デプロイ ステップバイステップガイド](./docs/VERCEL_DEPLOY_GUIDE.md)**: 初めてでも分かる、画面操作から環境変数・Google OAuth 設定まで

### 📖 経験者の方へ

- **[開発計画書](./docs/DEVELOPMENT_PLAN.md)**: フェーズ別の開発計画とタスクリスト
- **[技術詳細](./docs/TECHNICAL_DETAILS.md)**: 技術スタックの詳細と実装パターン
- **[クイックスタート](./docs/QUICK_START.md)**: 開発開始までの手順とチェックリスト
- **[依存関係分析](./docs/DEPENDENCY_ANALYSIS.md)**: 依存関係の互換性チェックと構築環境の問題解決
- **[ステップバイステップガイド](./docs/STEP_BY_STEP_GUIDE.md)**: 詳細な実装手順

---

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

**まずは [docs/BEGINNER_GUIDE.md](./docs/BEGINNER_GUIDE.md) を読んでください。**  
分かりやすく丁寧に説明した完全ガイドです。

### 経験者の方

詳細な手順は [`docs/QUICK_START.md`](./docs/QUICK_START.md) を参照してください。

---

## 📁 プロジェクト構造

```
Inventory_Control_2/
├── docs/                   # ドキュメント
│   ├── BEGINNER_GUIDE.md
│   ├── MASTER_CHECKLIST.md
│   ├── DEVELOPMENT_PLAN.md
│   ├── TECHNICAL_DETAILS.md
│   ├── QUICK_START.md
│   ├── STEP_BY_STEP_GUIDE.md
│   ├── DEPENDENCY_ANALYSIS.md
│   └── README.md
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

## 🗺️ 開発フェーズ

詳細は [`docs/DEVELOPMENT_PLAN.md`](./docs/DEVELOPMENT_PLAN.md) を参照してください。

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

詳細は [`docs/BEGINNER_GUIDE.md`](./docs/BEGINNER_GUIDE.md) または [`docs/QUICK_START.md`](./docs/QUICK_START.md) を参照してください。

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

## 🐛 トラブルシューティング

- **[依存関係分析](./docs/DEPENDENCY_ANALYSIS.md)**: 依存関係や構築環境の問題と解決方法
- **[クイックスタート](./docs/QUICK_START.md)**: よくある問題と解決方法
- **[ステップバイステップガイド](./docs/STEP_BY_STEP_GUIDE.md)**: 各ステップでのトラブルシューティング

**推奨アプローチ:**
1. まず [`docs/STEP_BY_STEP_GUIDE.md`](./docs/STEP_BY_STEP_GUIDE.md) に従ってステップバイステップで実装
2. 問題が発生したら [`docs/DEPENDENCY_ANALYSIS.md`](./docs/DEPENDENCY_ANALYSIS.md) を参照
3. それでも解決しない場合は [`docs/QUICK_START.md`](./docs/QUICK_START.md) のトラブルシューティングセクションを確認

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

質問や問題がある場合は、以下のリソースを参照してください：

1. [`docs/BEGINNER_GUIDE.md`](./docs/BEGINNER_GUIDE.md) - 初心者向けガイド
2. [`docs/DEPENDENCY_ANALYSIS.md`](./docs/DEPENDENCY_ANALYSIS.md) - 依存関係の問題解決
3. [`docs/QUICK_START.md`](./docs/QUICK_START.md) - よくある問題と解決方法
