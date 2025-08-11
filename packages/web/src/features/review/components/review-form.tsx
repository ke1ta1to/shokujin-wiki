"use client";

import { Box, Button, FormHelperText, TextField } from "@mui/material";
import { useActionState, useEffect, useState } from "react";

import type { ReviewActionResult } from "../actions/review-actions";

import { ProductSelect } from "@/features/product/components/product-select";
import type { Product, Review } from "@/generated/prisma";

interface ReviewFormProps {
  onCreate?: (review: Review) => void;
  defaultValues?: Review & {
    product: Product | null;
  };
  action: Parameters<typeof useActionState<ReviewActionResult, FormData>>[0];
}

type ProductOption = {
  id: number;
  name: string;
  price: number;
};

export function ReviewForm({
  onCreate,
  defaultValues,
  action,
}: ReviewFormProps) {
  const [state, formAction, pending] = useActionState(action, {
    status: "pending",
  });

  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(
    defaultValues?.product != null
      ? {
          id: defaultValues.product.id,
          name: defaultValues.product.name,
          price: defaultValues.product.price,
        }
      : null,
  );

  const error =
    state.status === "error"
      ? [...(state?.formErrors || []), state?.message].join("\n")
      : null;

  useEffect(() => {
    if (state.status === "success") {
      // 成功時の処理
      const review = state.created || state.updated;
      if (review) {
        onCreate?.(review);
      }
      // 作成モードの場合のみフォームをリセット
      if (state.created) {
        setSelectedProduct(null);
      }
    }
  }, [onCreate, state]);

  return (
    <Box component="form" action={formAction}>
      {/* 全体のエラー表示 */}
      {!!error && (
        <FormHelperText error sx={{ whiteSpace: "pre-line" }}>
          {error}
        </FormHelperText>
      )}

      {/* 商品選択 */}
      <ProductSelect
        label="商品選択"
        name="productId"
        value={selectedProduct}
        onChange={(value) => setSelectedProduct(value as ProductOption | null)}
        required
        error={state.status === "error" && !!state.fieldErrors?.productId}
        helperText={
          state.status === "error" ? state.fieldErrors?.productId?.[0] : null
        }
      />

      {/* コメント */}
      <TextField
        label="コメント"
        variant="outlined"
        fullWidth
        margin="normal"
        required
        multiline
        rows={4}
        name="comment"
        autoComplete="off"
        error={state.status === "error" && !!state.fieldErrors?.comment}
        helperText={
          state.status === "error" ? state.fieldErrors?.comment : null
        }
        defaultValue={defaultValues?.comment}
      />

      {/* 画像URL（オプション） */}
      <TextField
        label="画像URL（オプション）"
        variant="outlined"
        fullWidth
        margin="normal"
        name="imageUrl"
        type="url"
        autoComplete="off"
        error={state.status === "error" && !!state.fieldErrors?.imageUrl}
        helperText={
          state.status === "error" ? state.fieldErrors?.imageUrl : null
        }
        defaultValue={defaultValues?.imageUrls?.[0]}
      />

      {/* 送信ボタン */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={pending || !selectedProduct}
        sx={{ mt: 2 }}
      >
        {pending ? "送信中..." : defaultValues?.comment ? "更新" : "送信"}
      </Button>
    </Box>
  );
}
