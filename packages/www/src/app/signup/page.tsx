"use client";

import { Box, Button, Typography } from "@mui/material";
import NextLink from "next/link";
import { useActionState } from "react";

import { signUp } from "@/actions/auth";
import { AppLayout } from "@/components/app-layout";
import { AuthForm } from "@/components/auth-form";

export default function SignUpPage() {
  const [state, formAction, pending] = useActionState(signUp, {
    success: true,
  });

  return (
    <AppLayout>
      <Typography variant="h5" component="h1" align="center" my={4}>
        新規登録
      </Typography>
      <AuthForm
        mode="signup"
        submitAction={formAction}
        disabled={pending}
        error={[...(state.formErrors || []), state.message].join("\n")}
        errorFields={{
          email: state.fieldErrors?.email?.join("\n"),
          password: state.fieldErrors?.password?.join("\n"),
          confirmPassword: state.fieldErrors?.confirmPassword?.join("\n"),
        }}
      />
      <Box display="flex" justifyContent="end" maxWidth={400} mx="auto">
        <Button
          component={NextLink}
          href="/signin"
          variant="text"
          color="inherit"
          size="small"
        >
          ログインページへ
        </Button>
      </Box>
    </AppLayout>
  );
}
