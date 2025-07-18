"use client";

import { Close as CloseIcon } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

import { ReviewForm } from "./review-form";

interface CreateReviewDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateReviewDialog({ open, onClose }: CreateReviewDialogProps) {
  const router = useRouter();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleCreate = useCallback(() => {
    toast(`レビューを投稿しました。`);
    router.refresh();
    onClose();
  }, [router, onClose]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth={!fullScreen}
      fullScreen={fullScreen}
      aria-labelledby="create-review-dialog-title"
    >
      <DialogTitle id="create-review-dialog-title">レビューを投稿</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <ReviewForm onCreate={handleCreate} />
      </DialogContent>
    </Dialog>
  );
}
