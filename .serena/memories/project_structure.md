# プロジェクト構造

## ルートディレクトリ

```
shokujin-wiki/
├── .husky/           # Gitフック設定
├── prisma/           # Prismaスキーマとマイグレーション
│   └── schema.prisma
├── public/           # 静的ファイル
├── src/              # ソースコード
├── .env.local        # 環境変数（gitignore）
├── .mcp.json         # MCPサーバー設定（serena）
├── CLAUDE.md         # Claude Code用ガイド
├── package.json      # 依存関係とスクリプト
├── pnpm-lock.yaml    # pnpmロックファイル
└── tsconfig.json     # TypeScript設定
```

## srcディレクトリ

```
src/
├── app/              # Next.js App Router
│   ├── (index)/      # トップページグループ（FAB付き）
│   ├── products/     # 商品関連ページ
│   ├── articles/     # 記事関連ページ
│   ├── reviews/      # レビュー関連ページ
│   ├── auth/         # 認証関連ページ
│   └── settings/     # 設定ページ（認証保護）
├── features/         # 機能別実装
│   ├── auth/
│   │   ├── actions/  # Server Actions
│   │   └── components/
│   ├── product/
│   ├── review/
│   └── article/
├── components/       # 共通コンポーネント
├── hooks/            # カスタムフック
├── lib/              # ライブラリ設定
│   ├── supabase/
│   │   ├── server.ts # サーバーサイドクライアント
│   │   └── client.ts # クライアントサイド
│   └── prisma.ts     # Prismaクライアント
├── utils/            # ユーティリティ関数
├── generated/prisma/ # Prisma生成ファイル（gitignore）
├── middleware.ts     # Next.jsミドルウェア（セッション管理）
└── theme.ts          # MUIテーマ設定
```

## 重要なパス

- Prismaクライアント出力: `src/generated/prisma/`
- Server Actions: `src/features/*/actions/*.ts`
- 環境変数: `.env.local`（DATABASE_URL, SUPABASE設定）
