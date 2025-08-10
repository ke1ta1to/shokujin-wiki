# 開発コマンド一覧

## 開発環境

```bash
# 開発サーバー起動（ユーザーが別ターミナルで実行）
pnpm dev

# 本番ビルド
pnpm build

# 本番サーバー起動
pnpm start
```

## コード品質チェック（タスク完了時に実行）

```bash
# TypeScript型チェック
pnpm check-types

# ESLint実行（自動修正付き）
pnpm lint:fix

# Prettierフォーマット
pnpm format

# ESLintチェック（修正なし）
pnpm lint

# Prettierチェック（修正なし）
pnpm format:check
```

## データベース関連

```bash
# Prismaコマンド実行（.env.local使用）
pnpm prisma [command]

# データベースマイグレーション
pnpm prisma migrate dev

# Prismaクライアント生成
pnpm prisma generate

# データベースシード実行
pnpm prisma db seed

# Prisma Studio起動（データベース管理UI）
pnpm prisma studio
```

## Gitフック（Husky）

pre-commitフック:

1. `pnpm check-types` - TypeScript型チェック
2. `pnpm lint` - ESLintチェック
3. `pnpm format:check` - Prettierチェック

## システムコマンド（Darwin）

- `ls` - ファイル一覧
- `cd` - ディレクトリ移動
- `git` - バージョン管理
- `grep` / `rg` (ripgrep) - ファイル内検索
