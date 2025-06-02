"use client";

import {
  Autocomplete,
  Box,
  Button,
  createFilterOptions,
  Dialog,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Paper,
  TextField,
} from "@mui/material";
import type { ComponentProps } from "react";
import { useActionState, useState } from "react";

import { createEat } from "../actions";

import { CreateProductForm } from "@/features/products/components/create-product-form";
import type { getProducts } from "@/features/products/db";

interface CreateEatFormProps {
  products: NonNullable<Awaited<ReturnType<typeof getProducts>>[number]>[];
}

type OptionType = Partial<CreateEatFormProps["products"][number]> & {
  inputValue?: string;
};

const filter = createFilterOptions<OptionType>();

export function CreateEatForm({
  products: currentProducts,
}: CreateEatFormProps) {
  const [inputProductStr, setInputProductStr] = useState("");
  const [products, setProducts] = useState<OptionType[]>(currentProducts);

  const [state, formAction, pending] = useActionState(createEat, {
    success: true,
  });

  const error = [...(state.formErrors || []), state.message].join("\n");

  const [value, setValue] = useState<OptionType | null>(null);

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateProduct: ComponentProps<
    typeof CreateProductForm
  >["onCreate"] = (created) => {
    console.log("created", created);
    setProducts((prev) =>
      prev.some((p) => p.id === created.id) ? prev : [...prev, created],
    );
    setValue(created);
    setOpen(false);
  };

  return (
    <Box maxWidth={400} mx="auto" component="form" action={formAction}>
      <Paper sx={{ p: 2 }}>
        {/* 全体のエラー表示 */}
        {!!error && (
          <FormHelperText error sx={{ whiteSpace: "pre-line" }}>
            {error}
          </FormHelperText>
        )}

        {/* メニュー名 */}
        <Autocomplete
          value={value}
          onChange={(_event, newValue) => {
            if (typeof newValue === "string") {
              setTimeout(() => {
                setOpen(true);
                setInputProductStr(newValue);
              });
            } else if (newValue && newValue.inputValue) {
              setOpen(true);
              setInputProductStr(newValue.inputValue);
            } else {
              setValue(newValue);
            }
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);
            if (
              params.inputValue !== "" &&
              !filtered.some(
                (option) =>
                  option.name === params.inputValue ||
                  option.inputValue === params.inputValue,
              )
            ) {
              filtered.push({
                inputValue: params.inputValue,
                name: `${params.inputValue}を作成`,
              });
            }
            return filtered;
          }}
          fullWidth
          options={products}
          getOptionLabel={(product) => {
            if (typeof product === "string") {
              return product;
            }
            if (product.inputValue) {
              return product.inputValue;
            }
            return product.name || "";
          }}
          renderOption={(props, option) => {
            const { key, ...rest } = props;
            const uniqueKey = option.id
              ? `product-${option.id}`
              : option.inputValue
                ? `input-${option.inputValue}`
                : key;
            return (
              <Box
                key={uniqueKey}
                component="li"
                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                {...rest}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://placehold.jp/150x150.png"
                  alt=""
                  loading="lazy"
                  width={20}
                />
                {option.name}
              </Box>
            );
          }}
          clearOnBlur
          renderInput={(params) => (
            <TextField
              {...params}
              label="メニュー名"
              variant="outlined"
              margin="normal"
              required
              name="name"
              autoComplete="off"
              autoFocus
              error={!!state.fieldErrors?.name}
              helperText={state.fieldErrors?.name}
            />
          )}
          isOptionEqualToValue={(product, value) => product.id === value.id}
          freeSolo
        />
        {/* 商品作成ダイアログ */}
        <Dialog open={open} onClose={handleClose} scroll="body">
          <DialogTitle>{inputProductStr}を作成</DialogTitle>
          <DialogContent>
            <CreateProductForm
              defaultValues={{ name: inputProductStr }}
              onCreate={handleCreateProduct}
            />
          </DialogContent>
        </Dialog>
        {/* 感想 */}
        <TextField
          label="感想など"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          name="comment"
          autoComplete="off"
          multiline
          rows={4}
          error={!!state.fieldErrors?.comment}
          helperText={state.fieldErrors?.comment}
        />
        {/* 画像アップロードボタン */}
        <TextField
          label="画像アップロード"
          variant="outlined"
          fullWidth
          margin="normal"
          name="image"
          autoComplete="off"
          type="file"
          slotProps={{
            htmlInput: {
              accept: "image/*",
            },
            inputLabel: {
              shrink: true,
            },
          }}
          helperText={state.fieldErrors?.image}
          error={!!state.fieldErrors?.image}
        />
        {/* 送信ボタン */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={pending}
          sx={{ mt: 2 }}
        >
          {pending ? "送信中..." : "送信"}
        </Button>
      </Paper>
    </Box>
  );
}
