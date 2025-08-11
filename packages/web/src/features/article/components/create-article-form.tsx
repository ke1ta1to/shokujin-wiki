"use client";

import type { ComponentProps } from "react";
import { toast } from "sonner";

import { createArticle } from "../actions/article-actions";

import { ArticleForm } from "./article-form";

import type { Article } from "@/generated/prisma";

interface CreateArticleFormProps {
  defaultValues?: NonNullable<
    ComponentProps<typeof ArticleForm>["defaultValues"]
  >;
  onCreate?: (article: Article) => void;
  notify?: boolean;
}

export function CreateArticleForm({
  defaultValues,
  onCreate,
  notify = true,
}: CreateArticleFormProps) {
  const handleCreate = (article: Article) => {
    if (notify) {
      toast.success(`記事「${article.title}」を作成しました。`);
    }
    onCreate?.(article);
  };

  return (
    <ArticleForm
      onCreate={handleCreate}
      action={createArticle}
      defaultValues={defaultValues}
    />
  );
}
