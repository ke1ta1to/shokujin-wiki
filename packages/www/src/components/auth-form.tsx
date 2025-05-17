"use client";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import Image from "next/image";
import { useState } from "react";

import GitHubIcon from "@/assets/logo-github.svg";
import GoogleIcon from "@/assets/logo-google.svg";
import LineIcon from "@/assets/logo-line.svg";
import XIcon from "@/assets/logo-x.svg";

type AuthMode = "signin" | "signup";

type AuthFormProps = {
  mode?: AuthMode;
};

export function AuthForm({ mode = "signin" }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <Box maxWidth={400} mx="auto">
      <Paper sx={{ p: 2 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          name="email"
          label="メールアドレス"
          autoComplete={mode === "signin" ? "email" : "new-email"}
          autoFocus
        />

        <FormControl variant="outlined" margin="normal" required fullWidth>
          <InputLabel htmlFor="password">パスワード</InputLabel>
          <OutlinedInput
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete={
              mode === "signin" ? "current-password" : "new-password"
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="パスワードの表示切り替え"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="パスワード"
          />
        </FormControl>

        {mode === "signup" && (
          <FormControl variant="outlined" margin="normal" required fullWidth>
            <InputLabel htmlFor="confirm-password">
              パスワード（確認）
            </InputLabel>
            <OutlinedInput
              id="confirm-password"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="パスワードの表示切り替え"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="パスワード（確認）"
            />
          </FormControl>
        )}

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
          {mode === "signin" ? "ログイン" : "新規登録"}
        </Button>

        <Divider sx={{ my: 2 }}>または</Divider>

        <Stack spacing={2}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={
              <Image
                alt="Google"
                src={GoogleIcon}
                unoptimized
                style={{ width: 24, height: 24 }}
              />
            }
          >
            Google
          </Button>

          <Button
            fullWidth
            variant="outlined"
            startIcon={
              <Image
                alt="GitHub"
                src={GitHubIcon}
                unoptimized
                style={{ width: 24, height: 24 }}
              />
            }
          >
            GitHub
          </Button>

          <Button
            fullWidth
            variant="outlined"
            startIcon={
              <Image
                alt="X"
                src={XIcon}
                unoptimized
                style={{ width: 24, height: 24 }}
              />
            }
          >
            X
          </Button>

          <Button
            fullWidth
            variant="outlined"
            startIcon={
              <Image
                alt="LINE"
                src={LineIcon}
                unoptimized
                style={{ width: 24, height: 24 }}
              />
            }
          >
            LINE
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
