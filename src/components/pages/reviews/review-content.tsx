"use client";

import { ArrowBigLeft, DeleteIcon, EditIcon } from "lucide-react";
import NextLink from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ReviewDeleteDialog } from "@/features/reviews/components/review-delete-dialog";
import { ReviewEditDialog } from "@/features/reviews/components/review-edit-dialog";
import { ReviewPreview } from "@/features/reviews/components/review-preview";
import { $api } from "@/lib/api-client";

export interface ReviewContentProps {
  reviewId: number;
}

export function ReviewContent(props: ReviewContentProps) {
  const { reviewId } = props;

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

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
      <div className="flex gap-2">
        <Button variant="secondary" size="icon" className="mr-auto" asChild>
          <NextLink href="/">
            <ArrowBigLeft />
          </NextLink>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpenEditDialog(true)}
        >
          <EditIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpenDeleteDialog(true)}
        >
          <DeleteIcon />
        </Button>
      </div>
      <ReviewPreview id={data.id} comment={data?.comment} />
      <ReviewEditDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        reviewId={reviewId}
        defaultValues={{ comment: data.comment || "" }}
      />
      <ReviewDeleteDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        reviewId={reviewId}
        reviewProps={{ id: reviewId, comment: data.comment }}
      />
    </>
  );
}
