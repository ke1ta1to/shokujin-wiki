"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updateReview } from "../actions/review-actions";

import { ReviewForm } from "./review-form";

import type { Product, Review } from "@/generated/prisma";

interface EditReviewFormProps {
  review: Review & {
    product: Product | null;
  };
  onUpdate?: (review: Review) => void;
  notify?: boolean;
}

export function EditReviewForm({
  review,
  onUpdate,
  notify = true,
}: EditReviewFormProps) {
  const router = useRouter();

  const handleUpdate = (updatedReview: Review) => {
    if (notify) {
      toast.success("レビューを更新しました。");
    }
    onUpdate?.(updatedReview);
    router.push(`/reviews/${updatedReview.id}`);
  };

  // updateReviewをバインド
  const boundUpdateReview = updateReview.bind(null, review.id);

  return (
    <ReviewForm
      onCreate={handleUpdate}
      action={boundUpdateReview}
      defaultValues={review}
    />
  );
}
