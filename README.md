# 食神Wiki

レビューと記事管理のWebアプリケーション

## 技術スタック

- Next.js 15.3.5 (App Router)
- TypeScript 5.8.3
- Material-UI 7.2.0
- Prisma 6.12.0 + PostgreSQL
- Supabase Auth

## セットアップ

### 必要要件

- Node.js 20以上
- pnpm
- PostgreSQL
- Supabase アカウント

### インストール

```bash
# 依存関係インストール
pnpm install

# 環境変数設定
cp .env.example .env.local
# .env.localに必要な値を設定

# データベースセットアップ
pnpm prisma migrate dev
pnpm prisma generate
```

### 環境変数

`.env.local`に以下を設定:

```env
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## 開発

```bash
# 開発サーバー起動
pnpm dev

# ビルド
pnpm build

# 型チェック
pnpm check-types

# リント
pnpm lint:fix

# フォーマット
pnpm format
```

## プロジェクト構成

```
src/
├── app/          # ページ・ルーティング
├── features/     # 機能別実装
├── components/   # 共通コンポーネント
├── lib/          # 外部ライブラリ設定
└── utils/        # ユーティリティ
```

## 主要機能

- 商品の登録・管理
- レビュー投稿（画像付き）
- 記事作成・公開
- ユーザー認証
