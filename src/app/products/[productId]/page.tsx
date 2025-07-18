import { Box, Divider, Typography } from "@mui/material";
import { notFound } from "next/navigation";

import { ProductDetail } from "@/features/product/components/product-detail";
import { ReviewList } from "@/features/review/components/review-list";
import prisma from "@/lib/prisma";

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;

  const productIdNumber = parseInt(productId, 10);
  if (isNaN(productIdNumber)) {
    notFound();
  }

  // 商品情報とレビューを別々に取得して最適化
  const [product, reviews, latestReviewWithImage, totalReviewCount] =
    await Promise.all([
      prisma.product.findUnique({
        where: { id: productIdNumber },
        include: {
          user: true,
        },
      }),
      prisma.review.findMany({
        where: { productId: productIdNumber },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 50, // 最大50件に制限
      }),
      // 最新の画像付きレビューから画像URLのみ取得
      prisma.review.findFirst({
        where: {
          productId: productIdNumber,
          imageUrls: {
            isEmpty: false,
          },
        },
        select: {
          imageUrls: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      // レビューの総数を取得
      prisma.review.count({
        where: { productId: productIdNumber },
      }),
    ]);

  if (!product) {
    notFound();
  }

  // 最初の画像URLを取得
  const latestImageUrl = latestReviewWithImage?.imageUrls[0] || null;

  return (
    <>
      <Box sx={{ overflow: "hidden" }}>
        <Box
          sx={{
            float: { xs: "none", md: "left" },
            mb: 2,
            mr: { xs: 0, md: 2 },
          }}
        >
          <ProductDetail product={product} latestImageUrl={latestImageUrl} />
        </Box>
        <Box>{/* 文 */}</Box>
      </Box>
      <Divider sx={{ my: 4 }} />
      <Box maxWidth="sm" mx="auto">
        <Typography variant="h5" component="h2" gutterBottom>
          レビュー ({totalReviewCount}件)
        </Typography>
        <ReviewList reviews={reviews} />
        {totalReviewCount > 50 && (
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 2 }}
          >
            最新の50件を表示しています
          </Typography>
        )}
      </Box>
    </>
  );
}
