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
import type { ComponentProps } from "react";
import { useCallback } from "react";

import { CreateReviewForm } from "./create-review-form";

interface CreateReviewDialogProps {
  open: boolean;
  onClose: () => void;
  defaultValues?: ComponentProps<typeof CreateReviewForm>["defaultValues"];
}

export function CreateReviewDialog({
  open,
  onClose,
  defaultValues,
}: CreateReviewDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleCreate = useCallback(() => {
    onClose();
  }, [onClose]);

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
        <CreateReviewForm
          onCreate={handleCreate}
          defaultValues={defaultValues}
        />
      </DialogContent>
    </Dialog>
  );
}
