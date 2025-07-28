import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  Create as CreateIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

import { ProductDetail } from "@/features/product/components/product-detail";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { productId } = await params;
  const productIdNumber = parseInt(productId, 10);

  if (isNaN(productIdNumber)) {
    return {};
  }

  const product = await prisma.product.findUnique({
    where: { id: productIdNumber },
    include: { mainArticle: true },
  });

  // 記事がない商品ページはnoindexにする
  if (product && !product.mainArticle) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {};
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;

  const productIdNumber = parseInt(productId, 10);
  if (isNaN(productIdNumber)) {
    notFound();
  }

  // 商品とそのメイン記事、レビューを取得
  const [product, latestReviewWithImage] = await Promise.all([
    prisma.product.findUnique({
      where: { id: productIdNumber },
      include: {
        mainArticle: true,
        user: true,
        _count: {
          select: { Review: true },
        },
      },
    }),
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
  ]);

  if (!product) {
    notFound();
  }

  // メイン記事があればそのページにリダイレクト
  if (product.mainArticle) {
    permanentRedirect(`/articles/${product.mainArticle.slug}`);
  }

  // ユーザー情報を取得
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const latestImageUrl = latestReviewWithImage?.imageUrls[0] || null;

  // メイン記事がない場合は記事作成を促すページを表示
  return (
    <Box>
      <Stack spacing={4} alignItems="center">
        <ProductDetail
          product={product}
          latestImageUrl={latestImageUrl}
          direction="row"
        />

        <Stack spacing={3} alignItems="center" textAlign="center">
          <DescriptionIcon sx={{ fontSize: 64, color: "text.secondary" }} />

          <Typography variant="h5" component="h2">
            この商品の記事はまだありません
          </Typography>

          <Typography variant="body1" color="text.secondary">
            商品の詳しい情報などをまとめた記事を作成して、
            他のユーザーと情報を共有しましょう。
          </Typography>

          {user ? (
            <NextLink href="/articles/new" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<CreateIcon />}
              >
                この商品の記事を作成する
              </Button>
            </NextLink>
          ) : (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  記事を作成するにはログインが必要です
                </Typography>
                <NextLink href="/auth/login" style={{ textDecoration: "none" }}>
                  <Button variant="contained" sx={{ mt: 2 }}>
                    ログイン
                  </Button>
                </NextLink>
              </CardContent>
            </Card>
          )}

          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              記事を作成すると...
            </Typography>
            <List dense sx={{ textAlign: "left" }}>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleOutlineIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="商品の詳細情報を分かりやすく整理できます"
                  slotProps={{
                    primary: {
                      variant: "body2",
                      color: "text.secondary",
                    },
                  }}
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleOutlineIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="使い方やコツを他のユーザーと共有できます"
                  slotProps={{
                    primary: {
                      variant: "body2",
                      color: "text.secondary",
                    },
                  }}
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleOutlineIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="レビューと合わせて総合的な情報提供ができます"
                  slotProps={{
                    primary: {
                      variant: "body2",
                      color: "text.secondary",
                    },
                  }}
                />
              </ListItem>
            </List>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
