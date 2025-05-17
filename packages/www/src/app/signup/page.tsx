import { Box, Button, Typography } from "@mui/material";
import NextLink from "next/link";

import { AuthForm } from "@/components/auth-form";
import { BaseLayout } from "@/components/base-layout";

export default function SignUpPage() {
  return (
    <BaseLayout>
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
    </BaseLayout>
  );
}
