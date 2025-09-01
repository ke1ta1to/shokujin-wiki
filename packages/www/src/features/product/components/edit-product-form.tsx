"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updateProduct } from "../actions/product-actions";

import { ProductForm } from "./product-form";

import type { Product } from "@/generated/prisma";

interface EditProductFormProps {
  product: Product;
  onUpdate?: (product: Product) => void;
  notify?: boolean;
}

export function EditProductForm({
  product,
  onUpdate,
  notify = true,
}: EditProductFormProps) {
  const router = useRouter();
  const handleUpdate = (updatedProduct: Product) => {
    if (notify) {
      toast.success(`商品「${updatedProduct.name}」を更新しました。`);
    }
    onUpdate?.(updatedProduct);
    router.push(`/products/${updatedProduct.id}`);
  };

  // updateProductをバインド
  const boundUpdateProduct = updateProduct.bind(null, product.id);

  return (
    <ProductForm
      onCreate={handleUpdate}
      action={boundUpdateProduct}
      defaultValues={{
        name: product.name,
        price: product.price,
      }}
    />
  );
}
