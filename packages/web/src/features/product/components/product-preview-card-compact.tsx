import { Verified as VerifiedIcon } from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Stack,
  Box,
  Paper,
} from "@mui/material";
import Image from "next/image";

import type { Product } from "@/generated/prisma";

interface ProductPreviewCardCompactProps {
  product: Product;
  latestImageUrl?: string | null;
}

export function ProductPreviewCardCompact({
  product,
  latestImageUrl,
}: ProductPreviewCardCompactProps) {
  return (
    <Card>
      <CardActionArea>
        <CardContent sx={{ py: 1, px: 1 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ overflow: "hidden" }}
          >
            {/* 画像セクション */}
            <Paper
              sx={{
                position: "relative",
                height: 40,
                width: 40,
                bgcolor: "grey.100",
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              {latestImageUrl ? (
                <Image
                  src={latestImageUrl}
                  alt={product.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="40px"
                />
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    color: "text.disabled",
                    fontSize: 12,
                  }}
                >
                  No Image
                </Box>
              )}
            </Paper>

            {/* テキストセクション */}
            <Typography
              variant="body2"
              component="h3"
              noWrap
              sx={{ overflow: "hidden", flex: 1 }}
            >
              {product.name}
            </Typography>

            {product.isVerified && (
              <VerifiedIcon
                color="primary"
                sx={{ fontSize: 16, flexShrink: 0 }}
              />
            )}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
