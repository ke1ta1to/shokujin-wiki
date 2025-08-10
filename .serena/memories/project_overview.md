# 食神Wiki プロジェクト概要

## プロジェクト目的

食品レビューと記事管理のWebアプリケーション

## 技術スタック

- **フレームワーク**: Next.js 15.3.5 (App Router) + React 19.1.0
- **言語**: TypeScript 5.8.3
- **UI**: Material-UI 7.2.0 + Emotion
- **認証**: Supabase Auth + SSR 0.6.1
- **データベース**: PostgreSQL + Prisma ORM 6.12.0
- **バリデーション**: Zod 4.0.5
- **パッケージマネージャー**: pnpm

## データモデル

- User: Supabase Auth連携、レビュー/商品/記事の作成者
- Product: 商品情報（価格、認証状態、メイン記事、関連記事）
- Article: 記事（タイトル、slug、マークダウン本文、公開状態）
- Review: レビュー（コメント、画像URL配列）
- ArticleProduct: 記事と商品の多対多リレーション

## 主要機能

- ユーザー認証（Supabase Auth）
- 商品管理（作成、検索、レビュー）
- 記事管理（作成、編集、公開）
- レビュー投稿（画像付き）

## 特徴

- Server Actionsによる API実装（API Routes不使用）
- Server/Client Componentの適切な使い分け
- React 19のuseActionState使用
- 商品画像はレビュー画像を使用（専用フィールドなし）
