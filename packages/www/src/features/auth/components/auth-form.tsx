"use client";

import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import Image from "next/image";
import type { ButtonHTMLAttributes } from "react";
import { useState } from "react";

import GitHubIcon from "@/assets/logo-github.svg";
import GoogleIcon from "@/assets/logo-google.svg";
import LineIcon from "@/assets/logo-line.svg";
import XIcon from "@/assets/logo-x.svg";

type AuthMode = "signin" | "signup";

type AuthFormProps = {
  mode?: AuthMode;
  submitAction: ButtonHTMLAttributes<HTMLButtonElement>["formAction"];
  disabled?: boolean;
  error?: string;
  errorFields?: {
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
};

export function AuthForm({
  mode = "signin",
  submitAction,
  disabled = false,
  error,
  errorFields,
}: AuthFormProps) {
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
    <Box maxWidth={400} mx="auto" component="form">
      <Paper sx={{ p: 2 }}>
        {/* 全体のエラー表示 */}
        {error && (
          <FormHelperText error sx={{ whiteSpace: "pre-line" }}>
            {error}
          </FormHelperText>
        )}

        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          name="email"
          label="メールアドレス"
          autoComplete={mode === "signin" ? "email" : "new-email"}
          autoFocus
          type="email"
          disabled={disabled}
          error={!!errorFields?.email}
          helperText={errorFields?.email}
          slotProps={{
            formHelperText: {
              sx: { whiteSpace: "pre-line" },
            },
          }}
        />

        <FormControl variant="outlined" margin="normal" required fullWidth>
          <InputLabel htmlFor="password" error={!!errorFields?.password}>
            パスワード
          </InputLabel>
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
                  tabIndex={-1}
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            }
            label="パスワード"
            disabled={disabled}
            error={!!errorFields?.password}
          />
          {errorFields?.password && (
            <FormHelperText error sx={{ whiteSpace: "pre-line" }}>
              {errorFields.password}
            </FormHelperText>
          )}
        </FormControl>

        {mode === "signup" && (
          <FormControl variant="outlined" margin="normal" required fullWidth>
            <InputLabel
              htmlFor="confirm-password"
              error={!!errorFields?.confirmPassword}
            >
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
                    tabIndex={-1}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              }
              label="パスワード（確認）"
              disabled={disabled}
              error={!!errorFields?.confirmPassword}
            />
            {errorFields?.confirmPassword && (
              <FormHelperText error sx={{ whiteSpace: "pre-line" }}>
                {errorFields.confirmPassword}
              </FormHelperText>
            )}
          </FormControl>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          formAction={submitAction}
          disabled={disabled}
        >
          {mode === "signin" ? "ログイン" : "新規登録"}
        </Button>

        <Divider sx={{ my: 2 }}>または</Divider>

        <Stack spacing={2}>
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            startIcon={
              <Image
                alt="Google"
                src={GoogleIcon}
                unoptimized
                style={{ width: 24, height: 24 }}
              />
            }
            disabled={disabled}
          >
            Google
          </Button>

          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            startIcon={
              <Image
                alt="GitHub"
                src={GitHubIcon}
                unoptimized
                style={{ width: 24, height: 24 }}
              />
            }
            disabled={disabled}
          >
            GitHub
          </Button>

          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            startIcon={
              <Image
                alt="X"
                src={XIcon}
                unoptimized
                style={{ width: 24, height: 24 }}
              />
            }
            disabled={disabled}
          >
            X
          </Button>

          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            startIcon={
              <Image
                alt="LINE"
                src={LineIcon}
                unoptimized
                style={{ width: 24, height: 24 }}
              />
            }
            disabled={disabled}
          >
            LINE
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
