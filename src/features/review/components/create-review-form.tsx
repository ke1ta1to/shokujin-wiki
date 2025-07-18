"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

import { ReviewForm } from "./review-form";

export function CreateReviewForm() {
  const router = useRouter();

  const handleCreate = useCallback(() => {
    toast(`レビューを投稿しました。`);
    router.refresh();
  }, [router]);

  return <ReviewForm onCreate={handleCreate} />;
}
