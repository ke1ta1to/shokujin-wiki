"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useCallback } from "react";

import { ProductForm } from "./product-form";

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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        backdrop: { style: { backgroundColor: "rgba(0, 0, 0, 0.3)" } },
      }}
    >
      <DialogTitle>新しい商品を作成</DialogTitle>
      <DialogContent>
        <ProductForm
          onCreate={handleCreate}
          defaultValues={{
            name: defaultName,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
      </DialogActions>
    </Dialog>
  );
}
