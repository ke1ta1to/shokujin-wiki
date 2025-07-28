import { Verified as VerifiedIcon } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import Image from "next/image";

import type { Product, User } from "@/generated/prisma";
import { formatPrice } from "@/utils/format-price";

interface ProductDetailProps {
  product: Product & {
    user: User | null;
  };
  latestImageUrl: string | null;
}

export function ProductDetail({ product, latestImageUrl }: ProductDetailProps) {
  const formattedDate = formatDistanceToNow(new Date(product.createdAt), {
    addSuffix: true,
    locale: ja,
  });

  return (
    <Stack
      direction={{
        xs: "column",
        lg: "row",
      }}
      spacing={3}
    >
      {/* 画像セクション */}
      <Paper
        sx={{
          position: "relative",
          height: { xs: 300, md: 200 },
          width: { xs: "100%", md: 200 },
          bgcolor: "grey.100",
          flexShrink: 0,
          overflow: "hidden",
          alignSelf: { xs: "center", lg: "start" },
        }}
      >
        {latestImageUrl ? (
          <Image
            src={latestImageUrl}
            alt={product.name}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 900px) 100vw, 400px"
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              p: 2,
            }}
          >
            <Typography variant="body1" color="text.secondary">
              画像がありません
              <br />
              写真付きのレビューを投稿すると
              <br />
              ここに表示されます
            </Typography>
          </Box>
        )}
      </Paper>

      <Box flex={1}>
        {/* 商品情報セクション */}
        <Stack spacing={3}>
          {/* 商品名と認証バッジ */}
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 1 }}
            >
              <Typography variant="h4" component="h1">
                {product.name}
              </Typography>
              {product.isVerified && (
                <VerifiedIcon color="primary" fontSize="medium" />
              )}
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {formattedDate}に投稿
            </Typography>
          </Box>

          {/* 価格 */}
          <Typography variant="h3" color="primary" fontWeight="bold">
            {formatPrice(product.price)}
          </Typography>
        </Stack>

        {/* 商品詳細カード */}
        <Card sx={{ mt: 3, width: "fit-content" }}>
          <CardContent>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  作成者
                </Typography>
                <Typography variant="body1">
                  {product.user
                    ? `ユーザー${product.user.id}`
                    : "削除されたユーザー"}
                </Typography>
              </Box>
              {/* <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  ステータス
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  {product.isVerified ? (
                    <Chip
                      label="認証済み"
                      color="primary"
                      size="small"
                      icon={<VerifiedIcon />}
                    />
                  ) : (
                    <Chip label="未認証" size="small" />
                  )}
                </Box>
              </Box> */}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
}
