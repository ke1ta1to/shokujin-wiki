"use client";

import type { ComponentProps } from "react";
import { toast } from "sonner";

import { createProduct } from "../actions/product-actions";

import { ProductForm } from "./product-form";

import type { Product } from "@/generated/prisma";

interface CreateProductFormProps {
  onCreate?: (product: Product) => void;
  defaultValues?: ComponentProps<typeof ProductForm>["defaultValues"];
  notify?: boolean;
}

export function CreateProductForm({
  onCreate,
  defaultValues,
  notify = true,
}: CreateProductFormProps) {
  const handleCreate = (product: Product) => {
    if (notify) {
      toast(`商品「${product.name}」を作成しました。`);
    }
    onCreate?.(product);
  };

  return (
    <ProductForm
      onCreate={handleCreate}
      action={createProduct}
      defaultValues={defaultValues}
    />
  );
}
