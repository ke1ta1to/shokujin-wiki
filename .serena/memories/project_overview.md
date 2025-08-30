# 食神Wiki プロジェクト概要

## プロジェクトの目的

レビューと記事管理のWebアプリケーション。商品の登録・管理、レビュー投稿（画像付き）、記事作成・公開、ユーザー認証機能を提供。

## 技術スタック

- **フレームワーク**: Next.js 15.3.5 (App Router)
- **言語**: TypeScript 5.8.3
- **UI**: Material-UI 7.2.0
- **データベース**: Prisma 6.12.0 + PostgreSQL
- **認証**: Supabase Auth
- **パッケージマネージャー**: pnpm 10.14.0

## モノレポ構成

pnpm workspaceを使用したモノレポ構成で、現在はwebパッケージ（@repo/www）のみ存在。
