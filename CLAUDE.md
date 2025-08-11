# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

**食神Wiki** - 食品レビューと記事管理のWebアプリケーション

### 技術スタック

- **フレームワーク**: Next.js 15.3.5 (App Router) + React 19.1.0
- **言語**: TypeScript 5.8.3
- **UI**: Material-UI 7.2.0 + Emotion
- **認証**: Supabase Auth + SSR 0.6.1
- **データベース**: PostgreSQL + Prisma ORM 6.12.0
- **バリデーション**: Zod 4.0.5
- **パッケージマネージャー**: pnpm workspace（モノレポ構成）

### データモデル

```
User (Supabase Auth連携)
├── Review[] - 投稿レビュー
├── Product[] - 作成商品
└── Article[] - 作成記事

Product (商品)
├── mainArticle? - メイン記事（1対1）
├── articles[] - 関連記事（多対多）
├── reviews[] - レビュー
└── isVerified - 認証状態

Article (記事)
├── mainProduct? - メイン商品（1対1）
├── products[] - 関連商品（多対多）
├── isPublished - 公開状態
└── slug - URLパス

Review (レビュー)
├── product - 対象商品
├── user - 投稿者
└── imageUrls[] - 画像（商品画像として利用）
```

## 開発コマンド

### 基本操作

```bash
# 開発サーバー起動（ユーザーが別ターミナルで実行）
pnpm dev

# 本番ビルド
pnpm build

# 本番サーバー起動
pnpm start
```

### コード品質チェック（タスク完了時に実行）

```bash
# TypeScript型チェック
pnpm check-types

# ESLint実行（自動修正付き）
# インポート順序エラーや軽微なESLintエラーを自動修正
pnpm lint:fix

# Prettierフォーマット
pnpm format

# ESLintチェック（修正なし）
pnpm lint

# Prettierチェック（修正なし）
pnpm format:check
```

### データベース操作

```bash
# packages/webディレクトリから実行
cd packages/web

# データベースマイグレーション
pnpm prisma migrate dev

# Prismaクライアント生成
pnpm prisma generate

# データベースシード実行
pnpm prisma db seed

# Prisma Studio起動（データベース管理UI）
pnpm prisma studio
```

## アーキテクチャ

### ディレクトリ構造

```
packages/web/src/
├── app/          # App Router（ページ・レイアウト）
├── features/     # 機能別実装
│   ├── auth/     # 認証
│   ├── product/  # 商品管理
│   ├── review/   # レビュー
│   ├── article/  # 記事
│   └── s3/       # ファイルアップロード
├── components/   # 共通コンポーネント
├── lib/          # 外部ライブラリ設定
└── utils/        # ユーティリティ
```

### 機能別ディレクトリ構成

各featureは以下の構成：

- `components/` - UIコンポーネント
- `actions/` - Server Actions

## コーディング規約

### Server Actions（API Routes不使用）

```typescript
// src/features/*/actions/*.ts
"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

type ActionResult = {
  status: "error" | "success" | "pending";
  message?: string;
  errors?: Record<string, string[]>;
};

export async function createItemAction(
  formData: FormData,
): Promise<ActionResult> {
  // 1. 認証チェック
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "ログインが必要です" };

  // 2. Zodバリデーション
  const schema = z.object({
    name: z.string().min(1, "必須項目です"),
  });
  const validatedFields = schema.safeParse({
    name: formData.get("name"),
  });
  if (!validatedFields.success) {
    return {
      status: "error",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 3. Prisma操作
  try {
    await prisma.item.create({
      data: { ...validatedFields.data, userId: user.id },
    });
    return { status: "success", message: "作成しました" };
  } catch (error) {
    return { status: "error", message: "エラーが発生しました" };
  }
}
```

### Server/Client Component

**Server Component（デフォルト）**：

```typescript
// "use client"なし = Server Component
export default async function ItemList() {
  const items = await prisma.item.findMany();
  return <ItemGrid items={items} />;
}
```

**Client Component（インタラクティブ要素）**：

```typescript
"use client";
import { useActionState } from "react"; // React 19

export function ItemForm() {
  const [state, formAction, pending] = useActionState(createItemAction, {
    status: "pending" as const,
  });
  return <form action={formAction}>...</form>;
}
```

### Next.js 15 / React 19特有の実装

```typescript
// searchParamsがPromise（Next.js 15）
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
}

// useActionState（React 19でuseFormStateから変更）
import { useActionState } from "react";
```

### データフェッチ最適化

```typescript
// 並列フェッチ
const [reviews, count, image] = await Promise.all([
  prisma.review.findMany({ where: { productId } }),
  prisma.review.count({ where: { productId } }),
  prisma.review.findFirst({
    where: { productId, imageUrls: { isEmpty: false } },
    select: { imageUrls: true },
    orderBy: { createdAt: "desc" },
  }),
]);

// リレーション含めて取得
const product = await prisma.product.findUnique({
  where: { id },
  include: {
    reviews: { include: { user: true } },
    mainArticle: true,
    articles: { include: { article: true } },
  },
});
```

### Material-UI v7実装

```typescript
// slotProps使用（v7）
<Dialog slotProps={{ backdrop: { style: {...} } }} />

// アイコンインポート
import { Star as StarIcon } from "@mui/icons-material";

// Next.js Link
import NextLink from "next/link";
```

### Prisma型活用

```typescript
import type { User, Product } from "@/generated/prisma";
import type { Prisma } from "@/generated/prisma";

type ProductWithReviews = Prisma.ProductGetPayload<{
  include: { reviews: true };
}>;
```

### TypeScript

- 型インポート時は`type`キーワード使用
- Zodでバリデーションスキーマ定義

### ファイル命名

- コンポーネント: kebab-case（例: `product-form.tsx`）
- Server Actions: kebab-case（例: `product-actions.ts`）
- hooks: `use-*.ts`
- ページ: `page.tsx`（App Router規約）
- レイアウト: `layout.tsx`（App Router規約）

### インポート順序（ESLintで自動整理）

1. 外部ライブラリ
2. 内部モジュール（@/で始まる）
3. 相対パス
   ※グループ間に空行、アルファベット順
   ※`pnpm lint:fix`実行で自動修正される

## 重要な注意事項

### Git hooks

pre-commitで自動実行されるため、コミット前にエラーがないことを確認：

- 型チェック
- リント
- フォーマットチェック

### 環境変数

`.env.local`に以下が必要：

- `DATABASE_URL` - PostgreSQL接続文字列
- `DIRECT_URL` - Prisma用直接接続
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabaseアノンキー

### Prisma

- スキーマ変更時は必ず`pnpm prisma generate`実行
- 生成されたクライアントは`src/generated/prisma/`に配置

## 重要な仕様

### 商品画像の扱い

商品専用画像フィールドは存在せず、レビュー画像を商品画像として使用：

```typescript
// 最新レビュー画像を取得
const latestImage = await prisma.review.findFirst({
  where: { productId, imageUrls: { isEmpty: false } },
  select: { imageUrls: true },
  orderBy: { createdAt: "desc" },
});
const imageUrl = latestImage?.imageUrls[0] || null;
```

### URLルーティング

- `/products/[id]` → mainArticleがあれば `/articles/[slug]` へ301リダイレクト
- `/articles/[slug]` → 公開記事（`isPublished: true`）のみ表示

### 認証システム

**Supabase Auth + Prisma統合**：

1. Supabase Authで認証処理
2. Prismaでユーザーデータ管理（authIdで連携）
3. ミドルウェアでセッション管理（`src/middleware.ts`）
4. `AuthProtected`コンポーネントで保護
