"use client";

import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";
import { useActionState, useEffect, useRef, useState } from "react";

import type { ReviewActionResult } from "../actions/review-actions";

import { ProductSelect } from "@/features/product/components/product-select";
import { getPresignedUrlAction } from "@/features/s3/actions/s3-actions";
import { uploadAssets } from "@/features/s3/lib/upload-asset";
import type { Product, Review } from "@/generated/prisma";

interface ReviewFormProps {
  onCreate?: (review: Review) => void;
  defaultValues?: Review & {
    product: Product | null;
  };
  action: Parameters<typeof useActionState<ReviewActionResult, FormData>>[0];
}

type ProductOption = {
  id: number;
  name: string;
  price: number;
};

export function ReviewForm({
  onCreate,
  defaultValues,
  action,
}: ReviewFormProps) {
  const [state, formAction, pending] = useActionState(action, {
    status: "pending",
  });

  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(
    defaultValues?.product != null
      ? {
          id: defaultValues.product.id,
          name: defaultValues.product.name,
          price: defaultValues.product.price,
        }
      : null,
  );

  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
    defaultValues?.imageUrls?.[0] || null,
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const error =
    state.status === "error"
      ? [...(state?.formErrors || []), state?.message].join("\n")
      : null;

  useEffect(() => {
    if (state.status === "success") {
      // 成功時の処理
      const review = state.created || state.updated;
      if (review) {
        onCreate?.(review);
      }
      // 作成モードの場合のみフォームをリセット
      if (state.created) {
        setSelectedProduct(null);
        setUploadedImageUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  }, [onCreate, state]);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ファイルサイズチェック（20MB以下）
    if (file.size > 20 * 1024 * 1024) {
      setUploadError("ファイルサイズは20MB以下にしてください");
      return;
    }

    // 画像ファイルチェック
    if (!file.type.startsWith("image/")) {
      setUploadError("画像ファイルを選択してください");
      return;
    }

    setIsUploadingImage(true);
    setUploadError(null);

    try {
      // 署名付きURLを取得
      const result = await getPresignedUrlAction(file.name, file.type);
      if (result.status === "error") {
        setUploadError(result.message || "アップロード準備に失敗しました");
        return;
      }

      // S3にアップロード
      const uploadedUrl = await uploadAssets(result.presignedPost, file);
      setUploadedImageUrl(uploadedUrl);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadError("画像のアップロードに失敗しました");
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <Box component="form" action={formAction}>
      {/* 全体のエラー表示 */}
      {!!error && (
        <FormHelperText error sx={{ whiteSpace: "pre-line" }}>
          {error}
        </FormHelperText>
      )}

      {/* 商品選択 */}
      <ProductSelect
        label="商品選択"
        name="productId"
        value={selectedProduct}
        onChange={(value) => setSelectedProduct(value as ProductOption | null)}
        required
        error={state.status === "error" && !!state.fieldErrors?.productId}
        helperText={
          state.status === "error" ? state.fieldErrors?.productId?.[0] : null
        }
      />

      {/* コメント */}
      <TextField
        label="コメント"
        variant="outlined"
        fullWidth
        margin="normal"
        required
        multiline
        rows={4}
        name="comment"
        autoComplete="off"
        error={state.status === "error" && !!state.fieldErrors?.comment}
        helperText={
          state.status === "error" ? state.fieldErrors?.comment : null
        }
        defaultValue={defaultValues?.comment}
      />

      {/* 画像アップロード */}
      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          画像（オプション）
        </Typography>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: "none" }}
          id="image-upload"
        />
        <label htmlFor="image-upload">
          <Button
            variant="outlined"
            component="span"
            startIcon={
              isUploadingImage ? (
                <CircularProgress size={20} />
              ) : (
                <CloudUploadIcon />
              )
            }
            disabled={isUploadingImage}
            fullWidth
          >
            {isUploadingImage
              ? "アップロード中..."
              : uploadedImageUrl
                ? "画像を変更"
                : "画像を選択"}
          </Button>
        </label>
        {uploadError && (
          <FormHelperText error sx={{ mt: 1 }}>
            {uploadError}
          </FormHelperText>
        )}
        {uploadedImageUrl && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              アップロード済み画像:
            </Typography>
            <Box
              component="img"
              src={uploadedImageUrl}
              alt="Uploaded image"
              sx={{
                width: "100%",
                maxWidth: 400,
                height: "auto",
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
              }}
            />
          </Box>
        )}
      </Box>

      {/* 隠しフィールドで画像URLを送信 */}
      {uploadedImageUrl && (
        <input type="hidden" name="imageUrl" value={uploadedImageUrl} />
      )}

      {/* 送信ボタン */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={pending || !selectedProduct || isUploadingImage}
        sx={{ mt: 2 }}
      >
        {pending ? "送信中..." : defaultValues?.comment ? "更新" : "送信"}
      </Button>
    </Box>
  );
}
