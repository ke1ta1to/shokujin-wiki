import { Box, Divider, Typography } from "@mui/material";
import { notFound } from "next/navigation";

import { ProductDetail } from "@/features/product/components/product-detail";
import { ReviewList } from "@/features/review/components/review-list";
import prisma from "@/lib/prisma";

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;

  const productIdNumber = parseInt(productId, 10);
  if (isNaN(productIdNumber)) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: { id: productIdNumber },
    include: {
      user: true,
      Review: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductDetail product={product} />
      <Divider sx={{ my: 4 }} />
      <Box maxWidth="sm" mx="auto">
        <Typography variant="h5" component="h2" gutterBottom>
          レビュー ({product.Review.length}件)
        </Typography>
        <ReviewList reviews={product.Review} />
      </Box>
    </>
  );
}
