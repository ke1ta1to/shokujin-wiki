"use client";

import { toast } from "sonner";

import { ProductForm } from "./product-form";

import type { Product } from "@/generated/prisma";

export function CreateProductForm() {
  const handleCreate = (product: Product) => {
    toast(`商品「${product.name}」を作成しました。`);
  };

  return <ProductForm onCreate={handleCreate} />;
}
