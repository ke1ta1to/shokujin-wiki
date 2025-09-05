"use client";

import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { resetUserName, updateUserName } from "../actions/user-actions";

import type { User } from "@/generated/prisma";

interface UserSettingsFormProps {
  user: User | null;
}

export function UserSettingsForm({ user }: UserSettingsFormProps) {
  const router = useRouter();
  const [isResetting, setIsResetting] = useState(false);

  const [state, formAction, pending] = useActionState(updateUserName, {
    status: "pending",
  });

  useEffect(() => {
    if (state.status === "success") {
      toast.success("名前を更新しました");
      router.refresh();
    } else if (state.status === "error" && state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  const handleReset = async () => {
    setIsResetting(true);

    try {
      const result = await resetUserName();
      if (result.status === "success") {
        toast.success("名前をリセットしました");
        router.refresh();
      } else if (result.status === "error") {
        toast.error(result.message || "リセットに失敗しました");
      }
    } catch {
      toast.error("リセット中にエラーが発生しました");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        ユーザー設定
      </Typography>

      <Box component="form" action={formAction}>
        {/* 名前 */}
        <TextField
          label="名前"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          name="name"
          autoComplete="name"
          error={state.status === "error" && !!state.fieldErrors?.name}
          helperText={state.status === "error" ? state.fieldErrors?.name : null}
          defaultValue={user?.name || ""}
          placeholder="お名前を入力してください"
        />

        {/* ボタン */}
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={pending || isResetting}
          >
            {pending ? "更新中..." : "更新"}
          </Button>

          <Button
            type="button"
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={handleReset}
            disabled={pending || isResetting || !user?.name}
          >
            {isResetting ? "リセット中..." : "名前をリセット"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
