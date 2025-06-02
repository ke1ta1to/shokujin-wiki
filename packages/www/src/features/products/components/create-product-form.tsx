"use client";

import {
  Box,
  Button,
  FormHelperText,
  InputAdornment,
  Paper,
  TextField,
} from "@mui/material";
import type { InferInsertModel } from "drizzle-orm";
import { useActionState, useEffect } from "react";

import { createProduct } from "../actions";

import type { products } from "@/db/schema";

interface CreateProductFormProps {
  onCreate?: (created: InferInsertModel<typeof products>) => void;
  defaultValues?: {
    name?: string;
    price?: number;
  };
}

export function CreateProductForm({
  onCreate,
  defaultValues,
}: CreateProductFormProps) {
  const [state, formAction, pending] = useActionState(createProduct, {
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
    <Box maxWidth={400} mx="auto" component="form" action={formAction}>
      <Paper sx={{ p: 2 }}>
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
          name="price"
          type="number"
          autoComplete="off"
          slotProps={{
            htmlInput: {
              min: 0,
            },
            input: {
              startAdornment: (
                <InputAdornment position="start">¥</InputAdornment>
              ),
            },
          }}
          error={state.status === "error" && !!state.fieldErrors?.price}
          helperText={
            state.status === "error" ? state.fieldErrors?.price : null
          }
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
      </Paper>
    </Box>
  );
}
