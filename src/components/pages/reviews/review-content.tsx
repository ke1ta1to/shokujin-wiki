"use client";

import { EditIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ReviewEditDialog } from "@/features/reviews/components/review-edit-dialog";
import { ReviewPreview } from "@/features/reviews/components/review-preview";
import { $api } from "@/lib/api-client";

export interface ReviewContentProps {
  reviewId: number;
}

export function ReviewContent(props: ReviewContentProps) {
  const { reviewId } = props;

  const [openEditDialog, setOpenEditDialog] = useState(false);

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
    <>
      <div className="relative">
        <ReviewPreview id={data.id} comment={data?.comment} />
        <Button
          variant="outline"
          size="icon"
          className="absolute top-0 right-0"
          onClick={() => setOpenEditDialog(true)}
        >
          <EditIcon />
        </Button>
      </div>
      <ReviewEditDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        reviewId={reviewId}
        defaultValues={{ comment: data.comment || "" }}
      />
    </>
  );
}
