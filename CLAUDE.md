# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

**食神Wiki** - 食品レビューと記事管理のWebアプリケーション

モノレポ構成（pnpm workspace）で、Web/インフラを分離管理。

## 開発コマンド

### 必須のコード品質チェック

タスク完了時に必ず実行：

```bash
# 1. TypeScript型チェック
pnpm check-types

# 2. ESLint自動修正（インポート順序・軽微なエラーを自動修正）
pnpm lint:fix

# 3. Prettierフォーマット
pnpm format
```

### 基本操作

```bash
# 開発サーバー起動（ユーザーが別ターミナルで実行）
pnpm dev

# 本番ビルド
pnpm build

# 本番サーバー起動
pnpm start
```

### データベース操作

```bash
# packages/webディレクトリから実行
cd packages/web

# データベースマイグレーション
pnpm prisma migrate dev

# Prismaクライアント生成（スキーマ変更時必須）
pnpm prisma generate

# データベースシード実行
pnpm prisma db seed

# Prisma Studio起動（データベース管理UI）
pnpm prisma studio
```

### AWS CDK操作（インフラストラクチャ）

```bash
# packages/infraディレクトリから実行
cd packages/infra

# CDKビルド
pnpm build

# テスト実行
pnpm test

# CDKデプロイ
pnpm cdk deploy

# CDK差分確認
pnpm cdk diff

# CDKスタック一覧
pnpm cdk list

# CDK合成（CloudFormationテンプレート生成）
pnpm cdk synth
```

### 単体テスト

```bash
# インフラパッケージのテスト
cd packages/infra && pnpm test

# Webパッケージのテスト（現在未実装）
# テストフレームワークが導入された場合は確認必要
```

## アーキテクチャ

### 機能別ディレクトリ構成（features/）

各機能は独立したディレクトリで管理：

- `actions/` - Server Actions（"use server"宣言）
- `components/` - UIコンポーネント

```
packages/web/src/features/
├── auth/      # 認証
├── product/   # 商品管理
├── review/    # レビュー
├── article/   # 記事
└── s3/        # ファイルアップロード
```

### データモデルの関係性

- **User**: Supabase Auth連携（authIdフィールド）
- **Product**: 商品（mainArticleで1対1、articlesで多対多）
- **Article**: 記事（slugでURL管理、isPublishedで公開制御）
- **Review**: レビュー（imageUrlsが商品画像として使用される）

## コーディング規約

### Server Actions（API Routes不使用）

統一されたレスポンス型とエラーハンドリング：

```typescript
type ActionResult = {
  status: "error" | "success" | "pending";
  message?: string;
  errors?: Record<string, string[]>;
};
```

実装パターン：

1. Supabase Authで認証チェック
2. Zodでバリデーション
3. Prismaでデータベース操作

### Server/Client Component境界

- **Server Component**: デフォルト（"use client"なし）
- **Client Component**: インタラクティブ要素のみ"use client"
- React 19の`useActionState`使用（useFormStateから変更）

### Next.js 15 / React 19特有の実装

- searchParamsがPromise型
- 並列フェッチ推奨（Promise.all）
- リレーション含めたPrismaクエリ最適化

### Material-UI v7

- slotProps使用（v6のpropsから変更）
- Next.js Linkとの統合に注意

### TypeScript/Prisma

- 型インポート時は`import type`使用
- Prisma生成型は`@/generated/prisma`から
- Zodでバリデーションスキーマ定義

### ファイル命名規則

- コンポーネント/Actions: `kebab-case.tsx`
- hooks: `use-*.ts`
- ページ/レイアウト: App Router規約（`page.tsx`/`layout.tsx`）

### インポート順序

ESLintで自動管理。`pnpm lint:fix`で自動修正される。

## 重要な仕様と注意事項

### 商品画像の扱い

商品専用画像フィールドなし。レビューのimageUrlsを使用：

```typescript
const latestImage = await prisma.review.findFirst({
  where: { productId, imageUrls: { isEmpty: false } },
  select: { imageUrls: true },
  orderBy: { createdAt: "desc" },
});
```

### URLルーティング

- `/products/[id]` → mainArticleがあれば `/articles/[slug]` へ301リダイレクト
- `/articles/[slug]` → isPublished: trueの記事のみ表示

### 認証システム

Supabase Auth + Prisma統合：

1. Supabase Authで認証処理
2. PrismaでユーザーデータをauthIdで連携
3. middleware.tsでセッション管理

### Git hooks（Husky）

pre-commitで自動実行：

- 型チェック
- リント
- フォーマットチェック

エラーがある場合はコミットがブロックされる。

### 環境変数

`.env.local`に必要：

- `DATABASE_URL` - PostgreSQL接続文字列
- `DIRECT_URL` - Prisma用直接接続
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Prismaクライアント生成

スキーマ変更時は必ず実行：

```bash
cd packages/web
pnpm prisma generate
```

生成先: `src/generated/prisma/`

## serena MCP設定

serena MCPが有効な場合、以下のメモリが利用可能：

- `project_overview` - プロジェクト概要
- `suggested_commands` - 推奨コマンド
- `coding_conventions` - コーディング規約
- `task_completion_checklist` - タスク完了チェックリスト

### 推奨ワークフロー

1. `mcp__serena__activate_project`でプロジェクトを有効化
2. `mcp__serena__check_onboarding_performed`でオンボーディング確認
3. 必要に応じて`mcp__serena__read_memory`でメモリ参照
4. シンボル操作には`find_symbol`/`replace_symbol_body`を優先使用

## Dockerファイル

`packages/web/Dockerfile`が存在。コンテナ化対応済み。
