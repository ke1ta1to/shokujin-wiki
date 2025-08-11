# プロジェクト構造

## ルートディレクトリ

- `/packages/` - モノレポのパッケージディレクトリ
- `/packages/web/` - メインのNext.jsアプリケーション

## packages/web/src/の構成

- `/app/` - Next.js App Routerのページとルーティング
- `/features/` - 機能別実装
  - `/auth/` - 認証関連
  - `/product/` - 商品管理
  - `/review/` - レビュー機能
  - `/article/` - 記事機能
  - `/s3/` - ファイルアップロード
- `/components/` - 共通コンポーネント
- `/lib/` - 外部ライブラリ設定（Supabase、Prismaなど）
- `/utils/` - ユーティリティ関数
- `/hooks/` - カスタムフック
- `/generated/` - 自動生成コード（Prismaクライアントなど）

## その他の重要ファイル

- `packages/web/prisma/` - Prismaスキーマとマイグレーション
- `.husky/` - Git hooks設定（pre-commit）
