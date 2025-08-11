"use client";

import { Box, Divider, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

import { ReviewPreview } from "./review-preview";

import type { Review, User } from "@/generated/prisma";

interface ReviewListProps {
  reviews: (Review & {
    user: User;
  })[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  const router = useRouter();

  const handleReviewClick = (reviewId: number) => {
    router.push(`/reviews/${reviewId}`);
  };

  if (reviews.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography color="text.secondary">まだレビューがありません</Typography>
      </Box>
    );
  }

  return (
    <Stack divider={<Divider />}>
      {reviews.map((review) => (
        <Box
          key={review.id}
          onClick={() => void handleReviewClick(review.id)}
          sx={{ cursor: "pointer" }}
        >
          <ReviewPreview review={review} />
        </Box>
      ))}
    </Stack>
  );
}
