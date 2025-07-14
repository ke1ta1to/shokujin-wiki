import { Container, Link, Typography } from "@mui/material";
import NextLink from "next/link";
import { Suspense } from "react";

import { LoginForm } from "@/features/auth/components/login-form";

export default async function LoginPage() {
  return (
    <Container maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        ログイン
      </Typography>

      <Suspense>
        <LoginForm />
      </Suspense>

      <Typography variant="body2" sx={{ mt: 2 }}>
        アカウントをお持ちでない場合は、
        <Link component={NextLink} href="/auth/sign-up">
          こちらからサインアップ
        </Link>
        してください。
      </Typography>
    </Container>
  );
}
