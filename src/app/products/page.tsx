import { Add as AddIcon } from "@mui/icons-material";
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import Link from "next/link";

import { Pagination } from "@/components/pagination";
import { ProductPreviewCard } from "@/features/product/components/product-preview-card";
import prisma from "@/lib/prisma";
import { getPaginationParams } from "@/utils/pagination";

const DEFAULT_PAGE_LIMIT = 50;
const PAGE_OPTIONS = [50, 100, 200];

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const { currentPage, limit, skip, take } = getPaginationParams(params, {
    defaultLimit: DEFAULT_PAGE_LIMIT,
  });

  const [totalCount, products] = await Promise.all([
    prisma.product.count(),
    prisma.product.findMany({
      skip,
      take,
      include: {
        _count: {
          select: { Review: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return (
    <Box>
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
      <Divider sx={{ my: 4 }} />
      <Pagination
        totalCount={totalCount}
        currentPage={currentPage}
        limit={limit}
        limitOptions={PAGE_OPTIONS}
      />
    </Box>
  );
}
