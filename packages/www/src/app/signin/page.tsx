import { Box, Button, Typography } from "@mui/material";
import NextLink from "next/link";

import { SignInForm } from "../../features/components/sign-in-form";

import { AppLayout } from "@/components/app-layout";

export default async function SignInPage() {
  return (
    <AppLayout>
      <Typography variant="h5" component="h1" align="center" my={4}>
        ログイン
      </Typography>
      <SignInForm />
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
