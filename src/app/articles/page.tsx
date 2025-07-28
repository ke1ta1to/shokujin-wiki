import { Grid, Typography, Box, Divider } from "@mui/material";
import Link from "next/link";

import { Pagination } from "@/components/pagination";
import { ArticlePreviewCard } from "@/features/article/components/article-preview-card";
import prisma from "@/lib/prisma";
import { getPaginationParams } from "@/utils/pagination";

const DEFAULT_PAGE_LIMIT = 20;
const PAGE_OPTIONS = [20, 50, 100];

interface ArticlesPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}

export default async function ArticlesPage({
  searchParams,
}: ArticlesPageProps) {
  const params = await searchParams;

  const { currentPage, limit, skip, take } = getPaginationParams(params, {
    defaultLimit: DEFAULT_PAGE_LIMIT,
  });

  const [totalCount, articlesWithMainProduct] = await Promise.all([
    prisma.article.count({
      where: { isPublished: true },
    }),
    prisma.article.findMany({
      where: { isPublished: true },
      skip,
      take,
      include: {
        user: {
          select: { id: true },
        },
        _count: {
          select: { products: true },
        },
        mainProduct: {
          include: {
            Review: {
              where: {
                imageUrls: { isEmpty: false },
              },
              orderBy: { createdAt: "desc" },
              take: 1,
              select: {
                imageUrls: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  // 各記事にメイン商品の最新画像URLを追加
  const articles = articlesWithMainProduct.map((article) => ({
    ...article,
    mainProductImageUrl: article.mainProduct?.Review[0]?.imageUrls[0] || null,
  }));

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        記事一覧
      </Typography>
      <Grid container spacing={2}>
        {articles.map((article) => (
          <Grid key={article.id} size={{ xs: 12, md: 6 }}>
            <Link
              href={`/articles/${article.slug}`}
              style={{ textDecoration: "none" }}
            >
              <ArticlePreviewCard article={article} />
            </Link>
          </Grid>
        ))}
      </Grid>
      {totalCount === 0 && (
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mt: 4 }}
        >
          記事がありません
        </Typography>
      )}
      {totalCount > 0 && (
        <>
          <Divider sx={{ my: 4 }} />
          <Pagination
            totalCount={totalCount}
            currentPage={currentPage}
            limit={limit}
            limitOptions={PAGE_OPTIONS}
          />
        </>
      )}
    </Box>
  );
}
