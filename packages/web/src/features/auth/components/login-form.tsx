"use client";

import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import {
  Alert,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const continueUrl = searchParams.get("continue") || "/";

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    const { email, password } = Object.fromEntries(
      new FormData(e.currentTarget),
    );
    if (typeof email !== "string" || typeof password !== "string") {
      throw new Error("Invalid form data");
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.refresh();
      router.push(continueUrl);
    } catch (error) {
      const errorStr =
        error instanceof Error ? error.message : "An error occurred";
      console.log(error);
      setError(errorStr);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper component="form" onSubmit={handleLogin} sx={{ padding: 2 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="メールアドレス"
        name="email"
        autoComplete="email"
        autoFocus
        variant="outlined"
      />

      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="パスワード"
        type={showPassword ? "text" : "password"}
        id="password"
        autoComplete="current-password"
        variant="outlined"
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      {error && <Alert severity="error">{error}</Alert>}

      <Button type="submit" fullWidth sx={{ mt: 2 }} disabled={isLoading}>
        ログイン
      </Button>
    </Paper>
  );
}
