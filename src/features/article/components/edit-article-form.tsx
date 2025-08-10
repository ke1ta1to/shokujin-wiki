"use client";

import type { ComponentProps } from "react";
import { toast } from "sonner";

import { updateArticle } from "../actions/article-actions";

import { ArticleForm } from "./article-form";

import type { Article, Product } from "@/generated/prisma";

type ProductOption = NonNullable<
  ComponentProps<typeof ArticleForm>["defaultValues"]
>["mainProduct"];

interface EditArticleFormProps {
  article: Article & {
    mainProduct: Product | null;
    products: Array<{
      product: Product;
    }>;
  };
  onUpdate?: (article: Article) => void;
  notify?: boolean;
}

export function EditArticleForm({
  article,
  onUpdate,
  notify = true,
}: EditArticleFormProps) {
  const handleUpdate = (updatedArticle: Article) => {
    if (notify) {
      toast.success(`記事「${updatedArticle.title}」を更新しました。`);
    }
    onUpdate?.(updatedArticle);
  };

  // updateArticleをバインド
  const boundUpdateArticle = updateArticle.bind(null, article.slug);

  return (
    <ArticleForm
      onCreate={handleUpdate}
      action={boundUpdateArticle}
      defaultValues={{
        title: article.title,
        slug: article.slug,
        content: article.content,
        isPublished: article.isPublished,
        mainProduct: article.mainProduct as ProductOption | null,
        relatedProducts: article.products.map((p) => p.product),
      }}
    />
  );
}
