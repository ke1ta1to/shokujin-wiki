import { Avatar, Box, Stack, Typography } from "@mui/material";

import type { eats } from "@/db/schema";

interface EatPreviewProps {
  eat: typeof eats.$inferSelect;
}

export function EatPreview({ eat }: EatPreviewProps) {
  // 日付のフォーマット関数
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(date));
  };

  // 画像のURLが存在する場合、最初の1つを表示
  const hasImages = eat.imageUrls && eat.imageUrls.length > 0;

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ display: "flex", gap: 2 }}>
        {/* アバター */}
        <Avatar />

        {/* メインコンテンツ */}
        <Box sx={{ flex: 1 }}>
          {/* ヘッダー */}
          <Box sx={{ display: "flex", alignItems: "start", mb: 1, gap: 1 }}>
            <Typography
              variant="subtitle1"
              component="h2"
              fontWeight="bold"
              lineHeight={1}
            >
              {eat.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ ml: "auto" }}
              whiteSpace="nowrap"
            >
              {formatDate(eat.createdAt)}
            </Typography>
          </Box>

          {/* 本文 */}
          <Typography
            variant="body2"
            sx={{ whiteSpace: "pre-line", mb: 2, overflow: "hidden" }}
          >
            {eat.content}
          </Typography>

          {/* 画像 */}
          {hasImages && (
            <Box
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                mb: 2,
                maxWidth: "100%",
                border: "1px solid #e0e0e0",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`http://localhost:54321/storage/v1/object/public/images/${eat.imageUrls[0]}`}
                alt={eat.name}
                style={{
                  width: "100%",
                  maxHeight: 300,
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </Box>
          )}

          {/* インタラクション部分（フッター） */}
          <Stack direction="row" spacing={4} sx={{ mt: 1, mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              詳細を見る
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
