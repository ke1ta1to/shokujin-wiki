"use client";

import { Close as CloseIcon } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useCallback } from "react";
import { toast } from "sonner";

import { ProductForm } from "@/features/product/components/product-form";
import type { Product } from "@/generated/prisma";

interface CreateProductDialogProps {
  open: boolean;
  onClose: () => void;
  productName: string;
  onProductCreated: (product: Product) => void;
}

export function CreateProductDialog({
  open,
  onClose,
  productName,
  onProductCreated,
}: CreateProductDialogProps) {
  const handleProductCreate = useCallback(
    (product: Product) => {
      onProductCreated(product);
      onClose();
      toast(`商品「${product.name}」を作成しました。`);
    },
    [onProductCreated, onClose],
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="create-product-dialog-title"
    >
      <DialogTitle id="create-product-dialog-title">
        新しい商品を追加
      </DialogTitle>
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
        <DialogContentText>
          「{productName}
          」が見つかりませんでした。新しい商品として追加しますか？
        </DialogContentText>

        <ProductForm
          onCreate={handleProductCreate}
          defaultValues={{ name: productName }}
        />
      </DialogContent>
    </Dialog>
  );
}
