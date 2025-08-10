import { Box, Divider } from "@mui/material";

import { Pagination } from "@/components/pagination";
import { CreateReviewForm } from "@/features/review/components/create-review-form";
import { ReviewList } from "@/features/review/components/review-list";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
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

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      {user != null && (
        <Box maxWidth="sm" mx="auto">
          <CreateReviewForm />
          <Divider sx={{ mt: 4 }} />
        </Box>
      )}

      <Box maxWidth="sm" mx="auto">
        <ReviewList reviews={reviews} />
      </Box>

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
