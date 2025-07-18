import { Box, Divider, Stack, Typography } from "@mui/material";

import { ReviewPreview } from "./review-preview";

import type { Review, User } from "@/generated/prisma";

interface ReviewListProps {
  reviews: (Review & {
    user: User;
  })[];
}

export function ReviewList({ reviews }: ReviewListProps) {
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
        <ReviewPreview key={review.id} review={review} />
      ))}
    </Stack>
  );
}
