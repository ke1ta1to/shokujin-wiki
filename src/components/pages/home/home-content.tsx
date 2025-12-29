"use client";

import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ReviewPreview } from "@/features/reviews/components/review-preview";
import { ReviewUploadDialog } from "@/features/reviews/components/review-upload-dialog";
import { $api } from "@/lib/api-client";

export function HomeContent() {
  const [openUploadDialog, setOpenUploadDialog] = useState(false);

  const { data, isError, error, isLoading } = $api.useQuery("get", "/reviews");
  if (isLoading || !data) {
    return null;
  }
  if (isError) {
    return <div>Error: {String(error)}</div>;
  }

  return (
    <>
      <div className="divide-y">
        {data.reviews.map((review) => (
          <Link
            href={`/reviews/${review.id}`}
            key={review.id}
            className="py-2 block hover:bg-gray-50"
          >
            <ReviewPreview id={review.id} comment={review.comment} />
          </Link>
        ))}
      </div>
      <Button
        size="icon"
        variant="default"
        className="fixed bottom-4 right-4"
        onClick={() => setOpenUploadDialog(true)}
      >
        <PlusIcon />
      </Button>
      <ReviewUploadDialog
        open={openUploadDialog}
        onOpenChange={setOpenUploadDialog}
      />
    </>
  );
}
