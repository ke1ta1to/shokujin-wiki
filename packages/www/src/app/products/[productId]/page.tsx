import { Box, CardMedia, Divider, Paper, Typography } from "@mui/material";
import { notFound } from "next/navigation";

import { AppLayout } from "@/components/app-layout";
import { getProductById } from "@/features/products/db";

interface ProductDetailPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { productId } = await params;
  const product = await getProductById(parseInt(productId));

  if (!product) {
    notFound();
  }

  // 価格表示のフォーマット関数
  const formatPrice = (price: number | null | undefined) => {
    if (price == null) return "価格未設定";
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
    }).format(price);
  };

  // 日付のフォーマット関数
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <AppLayout>
      <Box sx={{ pt: 2 }}>
        {/* 商品名 (中央上部) */}
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          sx={{ mb: 4, textAlign: "center" }}
        >
          {product.name}
        </Typography>

        {/* 商品情報カード - モバイルでは上部、PCでは右側にfloat */}
        <Box
          sx={{
            width: { sm: 280 },
            mb: { xs: 4, sm: 2 },
            ml: { sm: 2 },
            float: { sm: "right" },
          }}
        >
          <Paper variant="outlined" sx={{ overflow: "hidden" }}>
            {/* 商品画像（プレースホルダー） */}
            <CardMedia
              component="div"
              sx={{
                height: 200,
                bgcolor: "grey.100",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                商品イメージ
              </Typography>
            </CardMedia>

            <Box sx={{ p: 2 }}>
              <Typography variant="h6" component="div">
                {formatPrice(product.price)}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="body2" color="text.secondary">
                  商品ID: {product.id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  登録日: {formatDate(product.createdAt)}
                </Typography>
                {product.updatedAt.getTime() !==
                  product.createdAt.getTime() && (
                  <Typography variant="body2" color="text.secondary">
                    最終更新: {formatDate(product.updatedAt)}
                  </Typography>
                )}
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Wikiコンテンツ */}
        <Box>
          <Typography variant="body1">
            この商品の説明文がここに表示されます。商品に関する詳細情報や、特徴などを記述することができます。
          </Typography>

          <Typography variant="body1">
            この商品の使い方や、レビュー、おすすめのポイントなどもここに記載できます。Wikiのようにユーザーが情報を追加・編集できるようになる予定です。
          </Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
            特徴
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 2 }}>
            <li>特徴1: サンプルテキストです</li>
            <li>特徴2: サンプルテキストです</li>
            <li>特徴3: サンプルテキストです</li>
          </Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
            関連情報
          </Typography>
          <Typography variant="body1">
            関連する商品や情報へのリンクなどがここに表示されます。
          </Typography>
        </Box>
      </Box>
    </AppLayout>
  );
}
