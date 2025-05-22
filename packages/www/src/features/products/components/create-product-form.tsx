"use client";

import {
  Box,
  Button,
  FormHelperText,
  InputAdornment,
  Paper,
  TextField,
} from "@mui/material";
import { useActionState } from "react";

import { createProduct } from "../actions";

export function CreateProductForm() {
  const [state, formAction, pending] = useActionState(createProduct, {
    success: true,
  });

  const error = [...(state.formErrors || []), state.message].join("\n");

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
          error={!!state.fieldErrors?.name}
          helperText={state.fieldErrors?.name}
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
          error={!!state.fieldErrors?.price}
          helperText={state.fieldErrors?.price}
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
