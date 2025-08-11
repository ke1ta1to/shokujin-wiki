# 食神Wiki

食品レビューと記事管理のWebアプリケーション

## セットアップ

```bash
# 依存関係インストール
pnpm install

# 環境変数設定（packages/web/.env.local）
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# データベース初期化
cd packages/web
pnpm prisma migrate dev
pnpm prisma generate
```

## 開発

```bash
# 開発サーバー起動
pnpm dev

# コード品質チェック
pnpm check-types  # 型チェック
pnpm lint:fix     # ESLint（自動修正）
pnpm format       # フォーマット
```

## 技術スタック

- Next.js 15.3.5 (App Router) + React 19
- TypeScript 5.8.3
- Material-UI 7.2.0
- Prisma 6.12.0 + PostgreSQL
- Supabase Auth
- pnpm workspace（モノレポ）

## プロジェクト構成

```
shokujin-wiki/
├── packages/
│   └── web/                      # Next.jsアプリケーション
│       ├── prisma/
│       │   └── schema.prisma     # データベーススキーマ
│       └── src/
│           ├── app/              # Next.js App Router
│           │   ├── (index)/      # トップページグループ（FAB付き）
│           │   ├── products/     # 商品関連ページ
│           │   ├── articles/     # 記事関連ページ
│           │   ├── reviews/      # レビュー関連ページ
│           │   ├── auth/         # 認証関連ページ（login, sign-up）
│           │   ├── search/       # 検索ページ
│           │   └── settings/     # 設定ページ（認証保護）
│           ├── features/         # 機能別実装
│           │   ├── auth/
│           │   │   ├── actions/  # Server Actions（認証処理）
│           │   │   └── components/
│           │   ├── product/
│           │   │   ├── actions/  # Server Actions（商品CRUD）
│           │   │   └── components/
│           │   ├── review/
│           │   │   ├── actions/  # Server Actions（レビューCRUD）
│           │   │   └── components/
│           │   ├── article/
│           │   │   ├── actions/  # Server Actions（記事CRUD）
│           │   │   └── components/
│           │   └── s3/           # ファイルアップロード
│           ├── components/       # 共通UIコンポーネント
│           ├── hooks/            # カスタムフック
│           ├── lib/              # 外部ライブラリ設定
│           │   ├── supabase/     # Supabaseクライアント（server/client）
│           │   └── prisma.ts     # Prismaクライアント
│           ├── utils/            # ユーティリティ関数
│           ├── generated/prisma/ # Prisma生成ファイル（gitignore）
│           ├── middleware.ts     # Next.jsミドルウェア（セッション管理）
│           └── theme.ts          # Material-UIテーマ設定
├── .husky/                       # Gitフック設定（pre-commit）
└── CLAUDE.md                     # AI開発ガイドライン
```
