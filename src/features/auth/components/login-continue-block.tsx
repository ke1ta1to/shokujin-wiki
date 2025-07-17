"use client";

import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

import { useContinueUrl } from "@/hooks/useContinueUrl";

export default function LoginContinueBlock() {
  const router = useRouter();
  const { continueUrl } = useContinueUrl();

  const handleClickLogin = () => {
    router.push(`/auth/login?continue=${encodeURIComponent(continueUrl)}`);
  };

  return (
    <Box mt={8}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        続けるにはログインが必要です
      </Typography>
      <Box textAlign="center">
        <Button variant="contained" color="primary" onClick={handleClickLogin}>
          ログイン
        </Button>
      </Box>
    </Box>
  );
}
