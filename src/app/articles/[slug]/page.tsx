import { Box, Divider, Stack, Typography } from "@mui/material";
import NextLink from "next/link";
import { notFound } from "next/navigation";

import { ProductDetail } from "@/features/product/components/product-detail";
import { ProductPreviewCard } from "@/features/product/components/product-preview-card";
import { ReviewList } from "@/features/review/components/review-list";
import prisma from "@/lib/prisma";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug, isPublished: true },
    include: {
      user: true,
      mainProduct: {
        include: {
          user: true,
          _count: {
            select: { Review: true },
          },
        },
      },
      products: {
        include: {
          product: {
            include: {
              _count: {
                select: { Review: true },
              },
            },
          },
        },
      },
    },
  });

  if (!article) {
    notFound();
  }

  // メイン商品のレビューと画像を取得
  let mainProductReviews = null;
  let mainProductReviewCount = 0;
  let latestImageUrl = null;

  if (article.mainProduct) {
    const [reviews, reviewCount, latestReviewWithImage] = await Promise.all([
      prisma.review.findMany({
        where: { productId: article.mainProduct.id },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 50, // 最大50件に制限
      }),
      prisma.review.count({
        where: { productId: article.mainProduct.id },
      }),
      // 最新の画像付きレビューから画像URLのみ取得
      prisma.review.findFirst({
        where: {
          productId: article.mainProduct.id,
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
    ]);

    mainProductReviews = reviews;
    mainProductReviewCount = reviewCount;
    latestImageUrl = latestReviewWithImage?.imageUrls[0] || null;
  }

  return (
    <Stack spacing={2}>
      {article.mainProduct && (
        <Box
          sx={{
            float: { xs: "none", md: "left" },
            mb: 2,
            mr: { xs: 0, md: 2 },
          }}
        >
          <ProductDetail
            product={article.mainProduct}
            latestImageUrl={latestImageUrl}
          />
        </Box>
      )}

      <Typography variant="h4" component="h1">
        {article.title}
      </Typography>

      <Stack direction="row" spacing={2}>
        <Typography variant="body2" color="text.secondary">
          {new Date(article.createdAt).toLocaleString("ja-JP")}
        </Typography>
      </Stack>

      <Box component="pre" sx={{ whiteSpace: "pre-wrap" }}>
        {article.content}
      </Box>

      {article.products.length > 0 && (
        <>
          <Divider />
          <Typography variant="h5" component="h2">
            関連商品
          </Typography>
          <Stack spacing={2}>
            {article.products.map(({ product }) => (
              <NextLink
                key={product.id}
                href={`/products/${product.id}`}
                style={{ textDecoration: "none" }}
              >
                <ProductPreviewCard product={product} />
              </NextLink>
            ))}
          </Stack>
        </>
      )}

      {article.mainProduct && mainProductReviews && (
        <Box maxWidth="sm" width="100%" alignSelf="center">
          <Typography variant="h5" component="h3" gutterBottom>
            レビュー ({mainProductReviewCount}件)
          </Typography>
          <ReviewList reviews={mainProductReviews} />
          {mainProductReviewCount > 50 && (
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
      )}
    </Stack>
  );
}
