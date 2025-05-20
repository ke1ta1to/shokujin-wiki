import { Box, Button, Stack, Typography } from "@mui/material";
import NextLink from "next/link";

import { AppLayout } from "@/components/app-layout";

export default function NotFoundPage() {
  return (
    <AppLayout>
      <Stack
        spacing={4}
        alignItems="center"
        justifyContent="center"
        sx={{
          minHeight: "50vh",
          maxWidth: 600,
          margin: "0 auto",
        }}
      >
        <Typography variant="h3" component="h1" align="center">
          404 Not Found
        </Typography>
        <Typography variant="h5" component="p" align="center">
          ページが見つかりませんでした
        </Typography>
        <Typography
          variant="body1"
          component="p"
          align="center"
          color="text.secondary"
        >
          お探しのページは削除されたか、URLが変更された可能性があります。
        </Typography>
        <Box mt={2}>
          <Button
            component={NextLink}
            href="/"
            variant="contained"
            color="primary"
            size="large"
          >
            トップページに戻る
          </Button>
        </Box>
      </Stack>
    </AppLayout>
  );
}
