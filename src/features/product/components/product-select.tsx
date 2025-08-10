"use client";

import {
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import { searchProducts } from "@/features/product/actions/search-products";
import { CreateProductDialog } from "@/features/product/components/create-product-dialog";
import type { Product } from "@/generated/prisma";
import { formatPrice } from "@/utils/format-price";

type ProductOption = {
  id: number;
  name: string;
  price: number;
  inputValue?: string;
};

interface ProductSelectProps {
  label: string;
  name: string;
  multiple?: boolean;
  value?: ProductOption | ProductOption[] | null;
  onChange?: (value: ProductOption | ProductOption[] | null) => void;
  error?: boolean;
  helperText?: string | null;
  required?: boolean;
  excludeIds?: number[];
}

export function ProductSelect({
  label,
  name,
  multiple = false,
  value,
  onChange,
  error,
  helperText,
  required,
  excludeIds = [],
}: ProductSelectProps) {
  const [open, setOpen] = useState(false);
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProductName, setNewProductName] = useState("");

  // 商品を検索する関数
  const loadProducts = useCallback(
    async (searchTerm: string) => {
      setLoading(true);
      try {
        const products = await searchProducts(searchTerm);

        // 除外IDを適用
        const filteredProducts = products.filter(
          (product) => !excludeIds.includes(product.id),
        );

        setProductOptions(filteredProducts);
      } catch (error) {
        console.error("商品の読み込みに失敗しました:", error);
      } finally {
        setLoading(false);
      }
    },
    [excludeIds],
  );

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
      loadProducts(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, open, loadProducts]);

  // 商品作成ダイアログのハンドラー
  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setNewProductName("");
  }, []);

  // AutoCompleteコールバック関数
  const getOptionLabel = useCallback((option: ProductOption | string) => {
    if (typeof option === "string") {
      return option;
    }
    if (option.inputValue) {
      return option.inputValue;
    }
    return option.name;
  }, []);

  const renderOption = useCallback(
    (
      props: React.HTMLAttributes<HTMLLIElement> & {
        key: React.Key;
      },
      option: ProductOption,
    ) => {
      const { key, ...optionProps } = props;
      const isNewProduct = Boolean(option.inputValue);

      return (
        <Box key={key} component="li" {...optionProps}>
          <Typography variant="body1" flex={1}>
            {option.name}
          </Typography>
          {!isNewProduct && (
            <Typography variant="body2" color="text.secondary">
              {formatPrice(option.price)}
            </Typography>
          )}
        </Box>
      );
    },
    [],
  );

  const filterOptions = useCallback(
    (options: ProductOption[], params: { inputValue: string }) => {
      const filtered = options;

      const { inputValue } = params;
      const isExisting = options.some((option) => inputValue === option.name);
      if (inputValue !== "" && !isExisting) {
        const addNewOption: ProductOption = {
          id: -1,
          name: `「${inputValue}」を新規作成`,
          price: 0,
          inputValue,
        };
        filtered.push(addNewOption);
      }

      return filtered;
    },
    [],
  );

  const handleProductCreated = useCallback(
    (product: Product) => {
      // 新しく作成された商品を選択状態にする
      const newProductOption: ProductOption = {
        id: product.id,
        name: product.name,
        price: product.price,
      };

      if (multiple) {
        const currentValue = (value as ProductOption[]) || [];
        onChange?.([...currentValue, newProductOption]);
      } else {
        onChange?.(newProductOption);
      }

      setProductOptions((prev) => [newProductOption, ...prev]);
      setInputValue(product.name);
    },
    [multiple, onChange, value],
  );

  const handleChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (_: unknown, newValue: any) => {
      if (typeof newValue === "string") {
        // timeout to avoid instant validation of the dialog's form.
        setTimeout(() => {
          setDialogOpen(true);
          setNewProductName(newValue);
        });
      } else if (multiple && Array.isArray(newValue)) {
        // 複数選択の場合
        const hasNewItem = newValue.some(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (item: any) => typeof item === "object" && item?.inputValue,
        );
        if (hasNewItem) {
          const newItem = newValue.find(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (item: any) => typeof item === "object" && item?.inputValue,
          );
          if (newItem?.inputValue) {
            setDialogOpen(true);
            setNewProductName(newItem.inputValue);
          }
        } else {
          onChange?.(newValue);
        }
      } else if (
        newValue &&
        typeof newValue === "object" &&
        newValue.inputValue
      ) {
        // 単一選択で新規作成
        setDialogOpen(true);
        setNewProductName(newValue.inputValue);
      } else {
        onChange?.(newValue);
      }
    },
    [multiple, onChange],
  );

  return (
    <>
      <Autocomplete
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        value={value}
        onChange={handleChange}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => {
          setInputValue(newInputValue);
        }}
        options={productOptions}
        getOptionLabel={getOptionLabel}
        loading={loading}
        multiple={multiple}
        autoHighlight
        freeSolo
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        filterOptions={filterOptions}
        renderOption={renderOption}
        renderTags={
          multiple
            ? (tagValue, getTagProps) =>
                tagValue.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                    <Chip
                      key={key}
                      variant="outlined"
                      label={typeof option === "string" ? option : option.name}
                      {...tagProps}
                    />
                  );
                })
            : undefined
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            margin="normal"
            required={required}
            error={error}
            helperText={helperText}
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
      />

      {/* hidden inputs for form submission */}
      {!multiple && value && (
        <input type="hidden" name={name} value={(value as ProductOption).id} />
      )}
      {multiple && value && Array.isArray(value) && value.length > 0 && (
        <input
          type="hidden"
          name={name}
          value={value.map((v) => v.id).join(",")}
        />
      )}

      {/* 商品作成ダイアログ */}
      <CreateProductDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onProductCreated={handleProductCreated}
        defaultName={newProductName}
      />
    </>
  );
}
