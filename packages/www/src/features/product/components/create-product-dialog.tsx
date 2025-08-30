"use client";

import { Close as CloseIcon } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { useCallback } from "react";

import { CreateProductForm } from "./create-product-form";

import type { Product } from "@/generated/prisma";

interface CreateProductDialogProps {
  open: boolean;
  onClose: () => void;
  onProductCreated: (product: Product) => void;
  defaultName?: string;
}

export function CreateProductDialog({
  open,
  onClose,
  onProductCreated,
  defaultName,
}: CreateProductDialogProps) {
  const handleCreate = useCallback(
    (product: Product) => {
      onProductCreated(product);
      onClose();
    },
    [onClose, onProductCreated],
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>新しい商品を作成</DialogTitle>
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
        <CreateProductForm
          onCreate={handleCreate}
          defaultValues={{ name: defaultName }}
        />
      </DialogContent>
    </Dialog>
  );
}
