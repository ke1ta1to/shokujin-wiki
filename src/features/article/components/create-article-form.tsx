"use client";

import { toast } from "sonner";

import { ArticleForm } from "./article-form";

import type { Article } from "@/generated/prisma";

export function CreateArticleForm() {
  const handleCreate = (article: Article) => {
    toast.success(`記事「${article.title}」を作成しました。`);
  };

  return <ArticleForm onCreate={handleCreate} />;
}
