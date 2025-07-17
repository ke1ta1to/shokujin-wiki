import {
  Verified as VerifiedIcon,
  Comment as CommentIcon,
} from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Stack,
  Box,
} from "@mui/material";

import type { Product } from "@/generated/prisma";

interface ProductPreviewCardProps {
  product: Product & {
    _count?: {
      Review: number;
    };
  };
}

export function ProductPreviewCard({ product }: ProductPreviewCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
    }).format(price);
  };

  return (
    <Card>
      <CardActionArea>
        <CardContent>
          <Stack spacing={1}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
              sx={{ overflow: "hidden" }}
            >
              <Typography
                variant="h6"
                component="h3"
                noWrap
                sx={{ overflow: "hidden" }}
              >
                {product.name}
              </Typography>
              {product.isVerified && (
                <VerifiedIcon
                  color="primary"
                  fontSize="small"
                  sx={{ flexShrink: 0 }}
                />
              )}
            </Stack>
            <Typography variant="h4" color="primary" noWrap>
              {formatPrice(product.price)}
            </Typography>
            {product._count?.Review !== undefined && (
              <Box display="flex" alignItems="center" gap={0.5}>
                <CommentIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary" noWrap>
                  {product._count.Review}
                </Typography>
              </Box>
            )}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
