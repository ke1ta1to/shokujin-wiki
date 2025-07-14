"use client";

import { Alert, Button, Paper, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/utils/supabase/client";

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      router.push("/");
      router.refresh();
    } catch (error) {
      const errorStr =
        error instanceof Error ? error.message : "An error occurred";
      console.log(errorStr);
      setError(errorStr);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper component="form" onSubmit={handleSignUp} sx={{ padding: 2 }}>
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
        type="password"
        id="password"
        autoComplete="new-password"
        variant="outlined"
      />

      {error && <Alert severity="error">{error}</Alert>}

      <Button type="submit" fullWidth sx={{ mt: 2 }} disabled={isLoading}>
        サインアップ
      </Button>
    </Paper>
  );
}
