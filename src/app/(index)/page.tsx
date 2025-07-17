import { Box, Divider, Stack, Typography } from "@mui/material";

import { Pagination } from "@/components/pagination";
import { ReviewItem } from "@/features/review/components/review-item";
import prisma from "@/lib/prisma";
import { getPaginationParams } from "@/utils/pagination";

const DEFAULT_REVIEW_LIMIT = 20;
const REVIEW_LIMIT_OPTIONS = [10, 20, 50, 100] as const;

interface IndexPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}

export default async function IndexPage({ searchParams }: IndexPageProps) {
  const params = await searchParams;

  const { currentPage, limit, skip, take } = getPaginationParams(params, {
    defaultLimit: DEFAULT_REVIEW_LIMIT,
  });

  const [totalCount, reviews] = await Promise.all([
    prisma.review.count(),
    prisma.review.findMany({
      skip,
      take,
      include: {
        user: true,
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return (
    <>
      {reviews.length === 0 ? (
        <Box py={8} textAlign="center">
          <Typography variant="body1" color="text.secondary">
            レビューがありません
          </Typography>
        </Box>
      ) : (
        <Box maxWidth="sm" mx="auto">
          <Stack spacing={1} divider={<Divider />}>
            {reviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </Stack>
        </Box>
      )}
      <Divider sx={{ my: 4 }} />

      <Pagination
        totalCount={totalCount}
        currentPage={currentPage}
        limit={limit}
        limitOptions={REVIEW_LIMIT_OPTIONS}
      />
    </>
  );
}
