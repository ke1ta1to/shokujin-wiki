"use client";

import {
  Box,
  Button,
  FormHelperText,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useActionState, useEffect } from "react";

import type { ProductActionResult } from "../actions/product-actions";

import type { Product } from "@/generated/prisma";

interface ProductFormProps {
  onCreate?: (product: Product) => void;
  defaultValues?: {
    name?: string;
    price?: number;
  };
  action: Parameters<typeof useActionState<ProductActionResult, FormData>>[0];
}

export function ProductForm({
  onCreate,
  defaultValues,
  action,
}: ProductFormProps) {
  const [state, formAction, pending] = useActionState(action, {
    status: "pending",
  });

  const error =
    state.status === "error"
      ? [...(state?.formErrors || []), state?.message].join("\n")
      : null;

  useEffect(() => {
    if (state.status === "success") {
      // 成功時の処理
      onCreate?.(state.created);
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

      {/* 商品名 */}
      <TextField
        label="商品名"
        variant="outlined"
        fullWidth
        margin="normal"
        required
        name="name"
        autoComplete="off"
        autoFocus
        error={state.status === "error" && !!state.fieldErrors?.name}
        helperText={state.status === "error" ? state.fieldErrors?.name : null}
        defaultValue={defaultValues?.name}
      />

      {/* 価格 */}
      <TextField
        label="価格"
        variant="outlined"
        fullWidth
        margin="normal"
        required
        inputMode="numeric"
        name="price"
        type="number"
        autoComplete="off"
        slotProps={{
          htmlInput: {
            min: 0,
          },
          input: {
            startAdornment: <InputAdornment position="start">¥</InputAdornment>,
          },
        }}
        error={state.status === "error" && !!state.fieldErrors?.price}
        helperText={state.status === "error" ? state.fieldErrors?.price : null}
        defaultValue={defaultValues?.price}
      />

      {/* 送信ボタン */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={pending}
        sx={{ mt: 2 }}
      >
        {pending ? "送信中..." : "送信"}
      </Button>
    </Box>
  );
}
