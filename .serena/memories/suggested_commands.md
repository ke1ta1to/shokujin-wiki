# 開発コマンド一覧

## 基本コマンド（ルートディレクトリから実行）

```bash
# 開発サーバー起動（ユーザーが別ターミナルで実行）
pnpm dev

# 本番ビルド
pnpm build

# 本番サーバー起動
pnpm start
```

## コード品質チェック

```bash
# TypeScript型チェック
pnpm check-types

# ESLintチェック（エラー表示）
pnpm lint

# ESLint実行（自動修正付き）
pnpm lint:fix

# Prettierフォーマット
pnpm format

# Prettierチェック（CIで使用）
pnpm format:check
```

## Prisma関連（packages/webディレクトリから実行）

```bash
# データベースマイグレーション
pnpm prisma migrate dev

# Prismaクライアント生成
pnpm prisma generate

# Prisma Studio起動
pnpm prisma studio

# データベースシード実行
pnpm prisma db seed
```

## Git hooks

pre-commitで自動実行：

1. pnpm check-types
2. pnpm lint
3. pnpm format:check

エラーがある場合はコミットがブロックされるため、事前に修正が必要
