# 推奨コマンド

## 開発コマンド（ルートディレクトリ）

```bash
# 開発サーバー起動（ユーザーが別ターミナルで実行）
pnpm dev

# 本番ビルド
pnpm build

# 本番サーバー起動
pnpm start

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

## Webアプリケーション（packages/web）

```bash
cd packages/web

# データベースマイグレーション
pnpm prisma migrate dev

# Prismaクライアント生成
pnpm prisma generate

# データベースシード実行
pnpm prisma db seed

# Prisma Studio起動
pnpm prisma studio
```

## インフラストラクチャ（packages/infra）

```bash
cd packages/infra

# CDKビルド
pnpm build

# TypeScript型チェック
pnpm check-types

# ESLint実行（自動修正付き）
pnpm lint:fix

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

## タスク完了時の必須チェック

1. `pnpm check-types` - TypeScript型チェック
2. `pnpm lint:fix` - ESLint自動修正
3. `pnpm format` - Prettierフォーマット
