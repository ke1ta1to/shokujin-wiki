import { Box, Typography } from "@mui/material";

import { CreateArticleForm } from "@/features/article/components/create-article-form";
import prisma from "@/lib/prisma";

interface NewArticlePageProps {
  searchParams: Promise<{ productId?: string }>;
}

export default async function NewArticlePage({
  searchParams,
}: NewArticlePageProps) {
  const params = await searchParams;
  const productId = params.productId ? parseInt(params.productId, 10) : null;

  // productIdが指定されている場合は商品情報を取得
  const defaultMainProduct =
    productId && !isNaN(productId)
      ? await prisma.product.findUnique({
          where: { id: productId },
          select: { id: true, name: true, price: true },
        })
      : null;

  return (
    <Box mt={8}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        記事作成
      </Typography>
      <Box maxWidth={800} mx="auto">
        <CreateArticleForm
          defaultValues={{
            mainProduct: defaultMainProduct,
          }}
        />
      </Box>
    </Box>
  );
}
