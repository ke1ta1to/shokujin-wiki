import { Box, Button, Typography } from "@mui/material";
import NextLink from "next/link";

import { AppLayout } from "@/components/app-layout";
import { AuthForm } from "@/components/auth-form";

export default function SignUpPage() {
  return (
    <AppLayout>
      <Typography variant="h5" component="h1" align="center" my={4}>
        新規登録
      </Typography>
      <AuthForm mode="signup" />
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
