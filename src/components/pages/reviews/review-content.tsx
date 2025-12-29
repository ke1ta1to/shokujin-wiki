"use client";

import { ReviewPreview } from "@/features/reviews/components/review-preview";
import { $api } from "@/lib/api-client";

export interface ReviewContentProps {
  reviewId: number;
}

export function ReviewContent(props: ReviewContentProps) {
  const { reviewId } = props;

  const { data, isError, error, isLoading } = $api.useQuery(
    "get",
    "/reviews/{id}",
    { params: { path: { id: reviewId } } },
    { retry: false },
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data found.</div>;
  }

  return (
    <div>
      <ReviewPreview id={data.id} comment={data?.comment} />
    </div>
  );
}
