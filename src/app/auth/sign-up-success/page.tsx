import { Box, Typography } from "@mui/material";

export default async function SignUpSuccessPage() {
  return (
    <Box mt={8} mb={4}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        確認メールを送信しました
      </Typography>
      <Typography align="center">
        メールボックスを確認し、リンクをクリックしてアカウントを有効化してください。
      </Typography>
    </Box>
  );
}
