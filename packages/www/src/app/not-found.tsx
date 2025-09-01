import { HomeOutlined } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/material";
import NextLink from "next/link";

export default function NotFound() {
  return (
    <Stack
      spacing={3}
      alignItems="center"
      minHeight="50vh"
      justifyContent="center"
    >
      <Typography variant="h1" fontWeight="bold">
        404
      </Typography>
      <Typography variant="h5" component="h2" color="text.secondary">
        ページが見つかりません
      </Typography>
      <Typography variant="body1" color="text.secondary">
        お探しのページは存在しないか、移動または削除された可能性があります。
      </Typography>
      <Button
        component={NextLink}
        href="/"
        variant="contained"
        size="large"
        startIcon={<HomeOutlined />}
      >
        ホームに戻る
      </Button>
    </Stack>
  );
}
