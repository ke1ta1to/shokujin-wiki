import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { ReviewPreviewProps } from "./review-preview";
import { ReviewPreview } from "./review-preview";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { $api } from "@/lib/api-client";

export interface ReviewDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reviewId: number;
  reviewProps: ReviewPreviewProps;
}

export function ReviewDeleteDialog(props: ReviewDeleteDialogProps) {
  const { open, onOpenChange, reviewId, reviewProps } = props;

  const router = useRouter();
  const { mutate } = $api.useMutation("delete", "/reviews/{id}", {
    onSuccess() {
      onOpenChange(false);
      toast.success("レビューを削除しました");
      router.push("/");
    },
  });

  const onDelete = () => {
    mutate({
      params: { path: { id: reviewId } },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>レビュー削除</AlertDialogTitle>
          <AlertDialogDescription>
            この操作は元に戻せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="border-y py-2">
          <ReviewPreview {...reviewProps} />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>続行</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
