import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";

import type { getProductById } from "../db";

interface ProductPreviewProps {
  product: NonNullable<Awaited<ReturnType<typeof getProductById>>>;
}

export function ProductPreview({ product }: ProductPreviewProps) {
  // 価格表示のフォーマット関数
  const formatPrice = (price: number | null | undefined) => {
    if (price == null) return "価格未設定";
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
    }).format(price);
  };

  return (
    <Card elevation={0} sx={{ display: "flex", flexDirection: "column" }}>
      {/* 画像プレースホルダー（将来的に実装予定） */}
      <CardMedia
        component="div"
        sx={{
          height: 140,
          bgcolor: "grey.100",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption">商品イメージ</Typography>
      </CardMedia>

      {/* 商品情報 */}
      <CardContent>
        <Typography
          variant="subtitle1"
          component="h2"
          fontWeight="bold"
          sx={{ mb: 1 }}
        >
          {product.name}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2">{formatPrice(product.price)}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
