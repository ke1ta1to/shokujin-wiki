import { Edit as EditIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { notFound } from "next/navigation";

import { ArticleMarkdownContent } from "@/features/article/components/article-markdown-content";
import { ProductDetail } from "@/features/product/components/product-detail";
import { ProductPreviewCardCompact } from "@/features/product/components/product-preview-card-compact";
import { ReviewList } from "@/features/review/components/review-list";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

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

  // 全データを並列取得
  const [
    mainProductReviews,
    mainProductReviewCount,
    mainProductLatestImage,
    relatedProductImages,
  ] = await Promise.all([
    // メイン商品のレビュー
    article.mainProduct
      ? prisma.review.findMany({
          where: { productId: article.mainProduct.id },
          include: { user: true },
          orderBy: { createdAt: "desc" },
          take: 50,
        })
      : Promise.resolve(null),
    // メイン商品のレビュー数
    article.mainProduct
      ? prisma.review.count({
          where: { productId: article.mainProduct.id },
        })
      : Promise.resolve(0),
    // メイン商品の最新画像
    article.mainProduct
      ? prisma.review.findFirst({
          where: {
            productId: article.mainProduct.id,
            imageUrls: { isEmpty: false },
          },
          select: { imageUrls: true },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve(null),
    // 関連商品の最新画像
    article.products.length > 0
      ? prisma.review.findMany({
          where: {
            productId: {
              in: article.products.map(({ product }) => product.id),
            },
            imageUrls: { isEmpty: false },
          },
          select: { productId: true, imageUrls: true },
          distinct: ["productId"],
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([]),
  ]);

  const latestImageUrl = mainProductLatestImage?.imageUrls[0] || null;
  const relatedProductImageUrls = Object.fromEntries(
    article.products.map(({ product }) => [
      product.id,
      relatedProductImages.find((r) => r.productId === product.id)
        ?.imageUrls[0] || null,
    ]),
  );

  // ログインしていれば誰でも編集可能
  const canEdit = !!currentDbUser;

  return (
    <Stack spacing={2} maxWidth="md" mx="auto">
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        justifyContent="space-between"
      >
        <Typography variant="h4" component="h1">
          {article.title}
        </Typography>
        {canEdit && (
          <Button
            component={NextLink}
            href={`/articles/${slug}/edit`}
            variant="outlined"
            startIcon={<EditIcon />}
            size="small"
          >
            編集
          </Button>
        )}
      </Box>

      <Stack direction="row" spacing={2}>
        <Typography variant="body2" color="text.secondary">
          {new Date(article.createdAt).toLocaleString("ja-JP")}
        </Typography>
      </Stack>

      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row-reverse" }}
        gap={2}
        alignItems="start"
      >
        {article.mainProduct && (
          <Paper
            sx={{
              p: 2,
              flexShrink: 0,
              width: {
                xs: "100%",
                md: 250,
              },
            }}
          >
            <Stack spacing={2}>
              <ProductDetail
                product={article.mainProduct}
                latestImageUrl={latestImageUrl}
              />

              {user && (
                <Button
                  href={`/products/${article.mainProduct.id}/edit`}
                  style={{ textDecoration: "none" }}
                  component={NextLink}
                  variant="outlined"
                  size="small"
                  startIcon={<EditIcon />}
                >
                  編集
                </Button>
              )}

              {article.products.filter(
                ({ product }) => product.id !== article.mainProduct?.id,
              ).length > 0 && (
                <>
                  <Divider />
                  <Typography variant="h5" component="h2">
                    関連商品
                  </Typography>
                  <Stack spacing={1}>
                    {article.products
                      .filter(
                        ({ product }) => product.id !== article.mainProduct?.id,
                      )
                      .map(({ product }) => (
                        <NextLink
                          key={product.id}
                          href={`/products/${product.id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <ProductPreviewCardCompact
                            product={product}
                            latestImageUrl={relatedProductImageUrls[product.id]}
                          />
                        </NextLink>
                      ))}
                  </Stack>
                </>
              )}

              {mainProductReviewCount > 0 && (
                <Link
                  href="#reviews-section"
                  sx={{ cursor: "pointer", textAlign: "center" }}
                >
                  レビュー {mainProductReviewCount}件
                </Link>
              )}
            </Stack>
          </Paper>
        )}

        <Stack spacing={2} flex={1} width="100%">
          <ArticleMarkdownContent content={article.content} />

          {article.mainProduct && mainProductReviews && (
            <Box id="reviews-section">
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
      </Box>
    </Stack>
  );
}
