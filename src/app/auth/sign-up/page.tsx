import { Container, Link, Typography } from "@mui/material";
import NextLink from "next/link";

import { SignUpForm } from "@/features/auth/components/sign-up-form";

export default async function SignUpPage() {
  return (
    <Container maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        サインアップ
      </Typography>

      <SignUpForm />

      <Typography variant="body2" sx={{ mt: 2 }}>
        既にアカウントをお持ちの場合は、
        <Link component={NextLink} href="/auth/login">
          こちらからログイン
        </Link>
        してください。
      </Typography>
    </Container>
  );
}
