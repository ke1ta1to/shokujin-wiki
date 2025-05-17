import { Box, Button, Typography } from "@mui/material";
import NextLink from "next/link";

import { AppLayout } from "@/components/app-layout";
import { AuthForm } from "@/components/auth-form";

export default function SignInPage() {
  return (
    <AppLayout>
      <Typography variant="h5" component="h1" align="center" my={4}>
        ログイン
      </Typography>
      <AuthForm mode="signin" />
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
