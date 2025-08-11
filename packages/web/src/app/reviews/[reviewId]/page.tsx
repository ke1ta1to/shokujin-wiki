import { Edit as EditIcon } from "@mui/icons-material";
import { Box, Button, Container, Stack } from "@mui/material";
import NextLink from "next/link";
import { notFound } from "next/navigation";

import { ProductPreviewCard } from "@/features/product/components/product-preview-card";
import { ReviewPreview } from "@/features/review/components/review-preview";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

interface ReviewPageProps {
  params: Promise<{
    reviewId: string;
  }>;
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { reviewId } = await params;
  const reviewIdNumber = parseInt(reviewId, 10);

  if (isNaN(reviewIdNumber)) {
    notFound();
  }

  // 現在のユーザーを取得
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let currentDbUser = null;
  if (user) {
    currentDbUser = await prisma.user.findUnique({
      where: { authId: user.id },
    });
  }

  // レビューを取得
  const review = await prisma.review.findUnique({
    where: { id: reviewIdNumber },
    include: {
      user: true,
      product: {
        include: {
          mainArticle: true,
          _count: {
            select: { Review: true },
          },
        },
      },
    },
  });

  if (!review) {
    notFound();
  }

  // 作成者本人かどうかを判定
  const isOwner = !!currentDbUser && review.userId === currentDbUser.id;

  return (
    <Container maxWidth="sm">
      <Stack spacing={3}>
        {/* ヘッダー部分 */}
        <Box display="flex" alignItems="center">
          {isOwner && (
            <Button
              component={NextLink}
              href={`/reviews/${reviewId}/edit`}
              variant="outlined"
              startIcon={<EditIcon />}
              size="small"
              sx={{ ml: "auto" }}
            >
              編集
            </Button>
          )}
        </Box>

        {/* レビュー本体 */}
        <ReviewPreview review={review} />

        {/* 商品情報 */}
        {review.product && (
          <NextLink
            href={`/products/${review.product.id}`}
            style={{ textDecoration: "none" }}
          >
            <ProductPreviewCard product={review.product} />
          </NextLink>
        )}
      </Stack>
    </Container>
  );
}
