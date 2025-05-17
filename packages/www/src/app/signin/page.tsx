"use client";

import { Box, Button, Typography } from "@mui/material";
import NextLink from "next/link";
import { useActionState } from "react";

import { signIn } from "@/actions/auth";
import { AppLayout } from "@/components/app-layout";
import { AuthForm } from "@/components/auth-form";

export default function SignInPage() {
  const [state, formAction, pending] = useActionState(signIn, {
    success: true,
  });

  return (
    <AppLayout>
      <Typography variant="h5" component="h1" align="center" my={4}>
        ログイン
      </Typography>
      <AuthForm
        mode="signin"
        submitAction={formAction}
        disabled={pending}
        error={[...(state.formErrors || []), state.message].join("\n")}
        errorFields={{
          email: state.fieldErrors?.email?.join("\n"),
          password: state.fieldErrors?.password?.join("\n"),
        }}
      />
      <Box display="flex" justifyContent="end" maxWidth={400} mx="auto">
        <Button
          component={NextLink}
          href="/signup"
          variant="text"
          color="inherit"
          size="small"
        >
          新規登録ページへ
        </Button>
      </Box>
    </AppLayout>
  );
}
