"use client";

import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";
import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { createReview, searchProducts } from "../actions/review-actions";

import type { Review } from "@/generated/prisma";
import { formatPrice } from "@/utils/format-price";

interface ReviewFormProps {
  onCreate?: (review: Review) => void;
  defaultValues?: {
    comment?: string;
    productId?: number;
    imageUrl?: string;
  };
}

type ProductOption = {
  id: number;
  name: string;
  price: number;
};

export function ReviewForm({ onCreate, defaultValues }: ReviewFormProps) {
  const [state, formAction, pending] = useActionState(createReview, {
    status: "pending",
  });

  const [open, setOpen] = useState(false);
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(
    null,
  );
  const [productInputValue, setProductInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const error =
    state.status === "error"
      ? [...(state?.formErrors || []), state?.message].join("\n")
      : null;

  useEffect(() => {
    if (state.status === "success") {
      // 成功時の処理
      onCreate?.(state.created);
      // フォームをリセット
      setSelectedProduct(null);
      setProductInputValue("");
    }
  }, [onCreate, state]);

  // 商品データの読み込み
  const loadProducts = useCallback(async (query: string) => {
    // 既存のリクエストをキャンセル
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 新しいAbortControllerを作成
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      const products = await searchProducts(query);
      setProductOptions(products);
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("商品の読み込みに失敗しました:", error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Autocompleteが開いた時の処理
  const handleOpen = useCallback(() => {
    setOpen(true);
    // 初回オープン時に全商品を取得
    if (productOptions.length === 0) {
      loadProducts("");
    }
  }, [productOptions.length, loadProducts]);

  // Autocompleteが閉じた時の処理
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  // 入力値が変更された時の処理
  useEffect(() => {
    if (!open) {
      return;
    }

    const timer = setTimeout(() => {
      loadProducts(productInputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [productInputValue, open, loadProducts]);

  // コンポーネントのアンマウント時のクリーンアップ
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <Box component="form" action={formAction}>
      {/* 全体のエラー表示 */}
      {!!error && (
        <FormHelperText error sx={{ whiteSpace: "pre-line" }}>
          {error}
        </FormHelperText>
      )}

      {/* 商品選択 */}
      <Autocomplete
        id="product-select"
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        value={selectedProduct}
        onChange={(_, newValue) => {
          setSelectedProduct(newValue);
        }}
        inputValue={productInputValue}
        onInputChange={(_, newInputValue) => {
          setProductInputValue(newInputValue);
        }}
        options={productOptions}
        getOptionLabel={(option) => option.name}
        loading={loading}
        autoHighlight
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          return (
            <Box key={key} component="li" {...optionProps}>
              <Typography variant="body1" flex={1}>
                {option.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatPrice(option.price)}
              </Typography>
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="メニュー"
            margin="normal"
            required
            error={state.status === "error" && !!state.fieldErrors?.productId}
            helperText={
              state.status === "error" ? state.fieldErrors?.productId : null
            }
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              },
            }}
          />
        )}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        noOptionsText={loading ? "読み込み中..." : "商品が見つかりません"}
        loadingText="商品を読み込んでいます..."
        filterOptions={(x) => x} // サーバー側でフィルタリングするため、クライアント側のフィルタリングを無効化
      />

      {/* productIdのhidden input */}
      {selectedProduct && (
        <input type="hidden" name="productId" value={selectedProduct.id} />
      )}

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

      {/* 画像URL（オプション） */}
      <TextField
        label="画像URL（オプション）"
        variant="outlined"
        fullWidth
        margin="normal"
        name="imageUrl"
        type="url"
        autoComplete="off"
        error={state.status === "error" && !!state.fieldErrors?.imageUrl}
        helperText={
          state.status === "error" ? state.fieldErrors?.imageUrl : null
        }
        defaultValue={defaultValues?.imageUrl}
      />

      {/* 送信ボタン */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={pending || !selectedProduct}
        sx={{ mt: 2 }}
      >
        {pending ? "送信中..." : "送信"}
      </Button>
    </Box>
  );
}
