import { Avatar, Box, Divider, Stack, Typography } from "@mui/material";

import type { orders } from "@/db/schema";

interface OrderDetailProps {
  order: typeof orders.$inferSelect;
}

export function OrderDetail({ order }: OrderDetailProps) {
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

  // 画像のURLが存在する場合の処理
  const hasImages = order.imageUrls && order.imageUrls.length > 0;

  return (
    <Box>
      {/* ヘッダー */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Avatar />
        <Box>
          <Typography variant="h6" component="h1" fontWeight="bold">
            {order.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatDate(order.createdAt)}
            {order.updatedAt &&
              order.updatedAt.getTime() !== order.createdAt.getTime() && (
                <>更新: {formatDate(order.updatedAt)}</>
              )}
          </Typography>
        </Box>
      </Box>

      {/* 本文 */}
      <Typography
        variant="body1"
        sx={{
          whiteSpace: "pre-line",
          mb: 2,
        }}
      >
        {order.content}
      </Typography>

      {/* 画像 */}
      {hasImages && (
        <Box>
          <Stack spacing={2}>
            {order.imageUrls.map((imageUrl, index) => (
              <Box key={index}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`http://localhost:54321/storage/v1/object/public/images/${imageUrl}`}
                  alt={`${order.name} - 画像 ${index + 1}`}
                  style={{
                    width: "100%",
                    maxHeight: 500,
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* 追加情報 */}
      <Box>
        <Typography variant="body2" color="text.secondary">
          注文ID: {order.id}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ユーザーID: {order.userId}
        </Typography>
      </Box>
    </Box>
  );
}
