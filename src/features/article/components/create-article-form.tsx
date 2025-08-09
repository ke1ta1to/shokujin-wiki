"use client";

import type { ComponentProps } from "react";
import { toast } from "sonner";

import { ArticleForm } from "./article-form";

import type { Article } from "@/generated/prisma";

type ProductOption = NonNullable<
  ComponentProps<typeof ArticleForm>["defaultValues"]
>["mainProduct"];

interface CreateArticleFormProps {
  defaultProduct?: ProductOption | null;
}

export function CreateArticleForm({ defaultProduct }: CreateArticleFormProps) {
  const handleCreate = (article: Article) => {
    toast.success(`記事「${article.title}」を作成しました。`);
  };

  return (
    <ArticleForm
      onCreate={handleCreate}
      defaultValues={{
        mainProduct: defaultProduct,
      }}
    />
  );
}
