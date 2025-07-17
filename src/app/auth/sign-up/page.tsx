import { Box, Link, Typography } from "@mui/material";
import NextLink from "next/link";
import { Suspense } from "react";

import { SignUpForm } from "@/features/auth/components/sign-up-form";

export default async function SignUpPage() {
  return (
    <Box mt={8} mx="auto" maxWidth={400}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        サインアップ
      </Typography>

      <Suspense>
        <SignUpForm />
      </Suspense>

      <Typography variant="body2" sx={{ mt: 2 }}>
        既にアカウントをお持ちの場合は、
        <Link component={NextLink} href="/auth/login">
          こちらからログイン
        </Link>
        してください。
      </Typography>
    </Box>
  );
}
