"use client";

import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { useCallback } from "react";
import { toast } from "sonner";

import { createReview } from "../actions/review-actions";

import { ReviewForm } from "./review-form";

import type { Review } from "@/generated/prisma";

interface CreateReviewFormProps {
  onCreate?: (review: Review) => void;
  defaultValues?: ComponentProps<typeof ReviewForm>["defaultValues"];
  notify?: boolean;
}

export function CreateReviewForm({
  onCreate,
  defaultValues,
  notify = true,
}: CreateReviewFormProps) {
  const router = useRouter();

  const handleCreate = useCallback(
    (review: Review) => {
      if (notify) {
        toast(`レビューを投稿しました。`);
      }
      router.refresh();
      onCreate?.(review);
    },
    [router, onCreate, notify],
  );

  return (
    <ReviewForm
      onCreate={handleCreate}
      action={createReview}
      defaultValues={defaultValues}
    />
  );
}
