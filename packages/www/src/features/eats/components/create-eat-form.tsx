"use client";

import { Box, Button, FormHelperText, Paper, TextField } from "@mui/material";
import { useActionState } from "react";

import { createEat } from "../actions";

export function CreateEatForm() {
  const [state, formAction, pending] = useActionState(createEat, {
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

        {/* メニュー名 */}
        <TextField
          label="メニュー名"
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
        {/* 感想 */}
        <TextField
          label="感想など"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          name="comment"
          autoComplete="off"
          multiline
          rows={4}
          error={!!state.fieldErrors?.comment}
          helperText={state.fieldErrors?.comment}
        />
        {/* 画像アップロードボタン */}
        <TextField
          label="画像アップロード"
          variant="outlined"
          fullWidth
          margin="normal"
          name="image"
          autoComplete="off"
          type="file"
          slotProps={{
            htmlInput: {
              accept: "image/*",
            },
            inputLabel: {
              shrink: true,
            },
          }}
          helperText={state.fieldErrors?.image}
          error={!!state.fieldErrors?.image}
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
