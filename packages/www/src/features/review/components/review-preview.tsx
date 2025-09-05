"use client";

import { Avatar, Box, Chip, Stack, Typography } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import Image from "next/image";
import NextLink from "next/link";

import type { Product, Review, User } from "@/generated/prisma";
import { rgbDataURL } from "@/utils/rgb-data-url";

interface ReviewPreviewProps {
  review: Review & {
    user: User;
    product?: Product | null;
  };
}

export function ReviewPreview({ review }: ReviewPreviewProps) {
  const formattedDate = formatDistanceToNow(new Date(review.createdAt), {
    addSuffix: true,
    locale: ja,
  });

  // ユーザー名の表示（nameがあればname、なければユーザーID）
  const displayName = review.user.name || `ユーザー${review.user.id}`;
  const avatarText =
    review.user.name && review.user.name.trim().length > 0
      ? review.user.name.trim()[0]
      : review.user.id.toString()[0];

  return (
    <Stack direction="row" spacing={2} py={2}>
      {/* アバター */}
      <Avatar>{avatarText}</Avatar>

      {/* メインコンテンツ */}
      <Stack sx={{ flex: 1 }} spacing={1}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="start"
          justifyContent="space-between"
        >
          {/* ヘッダー */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle2" fontWeight="bold">
              {displayName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formattedDate}
            </Typography>
          </Stack>

          {/* 商品タグ */}
          {review.product && (
            <NextLink
              href={`/products/${review.product.id}`}
              style={{ textDecoration: "none" }}
              onClick={(e) => void e.stopPropagation()}
            >
              <Chip label={review.product.name} size="small" clickable />
            </NextLink>
          )}
        </Stack>

        {/* コメント */}
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
          {review.comment}
        </Typography>

        {/* 画像 */}
        {review.imageUrls.length > 0 && (
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: 300,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Image
              src={review.imageUrls[0]}
              alt=""
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 600px) 100vw, 600px"
              priority={false}
              placeholder="blur"
              blurDataURL={rgbDataURL(250, 250, 250)}
            />
          </Box>
        )}
      </Stack>
    </Stack>
  );
}
