import { Add as AddIcon } from "@mui/icons-material";
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import Link from "next/link";

import { ProductPreviewCard } from "@/features/product/components/product-preview-card";
import prisma from "@/lib/prisma";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      _count: {
        select: { Review: true },
      },
    },
  });
  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        商品一覧
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
          <Link href="/products/new">
            <Card sx={{ height: "100%", minHeight: 100 }}>
              <CardActionArea sx={{ height: "100%" }}>
                <CardContent
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <AddIcon fontSize="large" />
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        </Grid>
        {products.map((product) => (
          <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
            <ProductPreviewCard product={product} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
