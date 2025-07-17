import { Avatar, Box, Chip, Stack, Typography } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";

import type { Product, Review, User } from "@/generated/prisma";

interface ReviewItemProps {
  review: Review & {
    user: User;
    product?: Product | null;
  };
}

export function ReviewItem({ review }: ReviewItemProps) {
  const formattedDate = formatDistanceToNow(new Date(review.createdAt), {
    addSuffix: true,
    locale: ja,
  });

  return (
    <Stack direction="row" spacing={2} py={2}>
      {/* アバター */}
      <Avatar>{review.user.id}</Avatar>

      {/* メインコンテンツ */}
      <Box sx={{ flex: 1 }}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="start"
          justifyContent="space-between"
        >
          {/* ヘッダー */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle2" fontWeight="bold">
              ユーザー{review.user.id}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formattedDate}
            </Typography>
          </Stack>

          {/* 商品タグ */}
          {review.product && (
            <Link
              href={`/products/${review.product.id}`}
              style={{ textDecoration: "none" }}
            >
              <Chip label={review.product.name} size="small" clickable />
            </Link>
          )}
        </Stack>

        {/* コメント */}
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
          {review.comment}
        </Typography>

        {/* 画像 */}
        {review.imageUrls.length > 0 && (
          <Box
            component="img"
            src={review.imageUrls[0]}
            alt=""
            sx={{
              width: "100%",
              maxHeight: 300,
              objectFit: "cover",
              borderRadius: 2,
              mt: 1,
            }}
          />
        )}
      </Box>
    </Stack>
  );
}
