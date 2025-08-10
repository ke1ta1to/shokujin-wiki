# コーディング規約

## TypeScript/JavaScript

- **言語**: TypeScript 5.8.3
- **型定義**: Prismaの生成型を活用（@/generated/prisma）
- **importの順序**: ESLintで自動管理（alphabetical、改行区切り）
- **型インポート**: `import type` を使用

## Server Actions（API Routes不使用）

- ファイル先頭に `"use server"` 宣言
- Zodによるバリデーション
- 統一されたレスポンス型：
  ```typescript
  type ActionResult = {
    status: "error" | "success" | "pending";
    message?: string;
    errors?: Record<string, string[]>;
  };
  ```
- Supabase Authで認証チェック
- Prismaでデータベース操作

## コンポーネント

- **Server Component**: デフォルト（"use client"なし）
- **Client Component**: インタラクティブ要素に"use client"
- React 19の`useActionState`使用（useFormStateから変更）
- Material-UI v7のslotProps使用

## ファイル命名規則

- コンポーネント: `kebab-case.tsx`
- Server Actions: `*-actions.ts`
- hooks: `use-*.ts`
- ページ: `page.tsx`（App Router規約）
- レイアウト: `layout.tsx`（App Router規約）

## ディレクトリ構成

```
src/features/  # 機能別実装
  auth/
    actions/   # Server Actions
    components/  # UI Components
  product/
  review/
  article/
```

## Next.js 15特有の実装

- searchParamsがPromise型
- 並列データフェッチ推奨（Promise.all）
- リレーション含めたPrismaクエリ最適化

## 商品画像の仕様

- 商品専用画像フィールドなし
- レビューの`imageUrls`配列を商品画像として利用
- 最新レビュー画像を優先表示
