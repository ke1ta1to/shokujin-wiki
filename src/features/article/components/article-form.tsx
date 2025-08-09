"use client";

import {
  Box,
  Button,
  FormControlLabel,
  FormHelperText,
  Grid,
  Paper,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useActionState, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { createArticle, generateSlug } from "../actions/article-actions";

import { ArticleMarkdownContent } from "./article-markdown-content";
import { ProductSelect } from "./product-select";

import type { Article } from "@/generated/prisma";

type ProductOption = {
  id: number;
  name: string;
  price: number;
};

interface ArticleFormProps {
  onCreate?: (article: Article) => void;
  defaultValues?: {
    title?: string;
    slug?: string;
    content?: string;
    isPublished?: boolean;
  };
}

export function ArticleForm({ onCreate, defaultValues }: ArticleFormProps) {
  const [state, formAction, pending] = useActionState(createArticle, {
    status: "pending",
  });

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [title, setTitle] = useState(defaultValues?.title || "");
  const [slug, setSlug] = useState(defaultValues?.slug || "");
  const [content, setContent] = useState(defaultValues?.content || "");
  const [tabValue, setTabValue] = useState(0);
  const [isPublished, setIsPublished] = useState(
    defaultValues?.isPublished || false,
  );
  const [mainProduct, setMainProduct] = useState<ProductOption | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductOption[]>([]);
  const [slugGenerated, setSlugGenerated] = useState(false);
  const [generatingSlug, setGeneratingSlug] = useState(false);

  const error =
    state.status === "error"
      ? [...(state?.formErrors || []), state?.message].join("\n")
      : null;

  // タイトルからslugを自動生成
  const handleTitleBlur = useCallback(async () => {
    if (title && !slug && !slugGenerated) {
      setGeneratingSlug(true);
      try {
        const generated = await generateSlug(title);
        setSlug(generated);
        setSlugGenerated(true);
      } catch (error) {
        console.error("slug生成エラー:", error);
      } finally {
        setGeneratingSlug(false);
      }
    }
  }, [title, slug, slugGenerated]);

  // slugが手動で変更されたらフラグをリセット
  const handleSlugChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSlug(e.target.value);
      setSlugGenerated(false);
    },
    [],
  );

  // メイン商品変更時の処理
  const handleMainProductChange = useCallback(
    (value: ProductOption | null) => {
      setMainProduct(value);

      // メイン商品が関連商品に含まれている場合は除外
      if (value && relatedProducts.some((p) => p.id === value.id)) {
        setRelatedProducts((prev) => prev.filter((p) => p.id !== value.id));
        toast.info("メイン商品を関連商品から除外しました");
      }
    },
    [relatedProducts],
  );

  useEffect(() => {
    if (state.status === "success") {
      // 成功時の処理
      onCreate?.(state.created);
    }
  }, [onCreate, state]);

  return (
    <Box component="form" action={formAction}>
      {/* 全体のエラー表示 */}
      {!!error && (
        <FormHelperText error sx={{ whiteSpace: "pre-line", mb: 2 }}>
          {error}
        </FormHelperText>
      )}

      {/* タイトル */}
      <TextField
        label="タイトル"
        variant="outlined"
        fullWidth
        margin="normal"
        required
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleTitleBlur}
        autoComplete="off"
        autoFocus
        error={state.status === "error" && !!state.fieldErrors?.title}
        helperText={
          state.status === "error" ? state.fieldErrors?.title?.[0] : null
        }
      />

      {/* URLパス（slug） */}
      <TextField
        label="URLパス"
        variant="outlined"
        fullWidth
        margin="normal"
        required
        name="slug"
        value={slug}
        onChange={handleSlugChange}
        autoComplete="off"
        error={state.status === "error" && !!state.fieldErrors?.slug}
        helperText={
          state.status === "error"
            ? state.fieldErrors?.slug?.[0]
            : generatingSlug
              ? "生成中..."
              : "英小文字、数字、ハイフンのみ使用可能（例: ramen-special-guide）"
        }
        disabled={generatingSlug}
      />

      {/* 本文 */}
      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          本文 *
        </Typography>
        {isDesktop ? (
          // PC: 横並びレイアウト
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper variant="outlined">
                <Box
                  sx={{
                    p: 2,
                    borderBottom: 1,
                    borderColor: "divider",
                    bgcolor: "grey.50",
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    編集
                  </Typography>
                </Box>
                <Box>
                  <TextField
                    variant="outlined"
                    fullWidth
                    required
                    name="content"
                    multiline
                    minRows={15}
                    maxRows={25}
                    autoComplete="off"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    error={
                      state.status === "error" && !!state.fieldErrors?.content
                    }
                    helperText={
                      state.status === "error"
                        ? state.fieldErrors?.content?.[0]
                        : "マークダウン形式で記述できます"
                    }
                    placeholder="入力してください"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          border: "none",
                        },
                      },
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper variant="outlined">
                <Box
                  sx={{
                    p: 2,
                    borderBottom: 1,
                    borderColor: "divider",
                    bgcolor: "grey.50",
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    プレビュー
                  </Typography>
                </Box>
                <Box
                  sx={{
                    minHeight: 400,
                    maxHeight: 600,
                    overflowY: "auto",
                    p: 2,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                  }}
                >
                  {content ? (
                    <ArticleMarkdownContent content={content} />
                  ) : (
                    <Typography color="text.secondary">
                      プレビューする内容がありません
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        ) : (
          // スマホ: タブレイアウト
          <Paper variant="outlined" sx={{ borderRadius: 1 }}>
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
              variant="fullWidth"
              sx={{
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <Tab label="編集" />
              <Tab label="プレビュー" />
            </Tabs>
            <Box>
              {tabValue === 0 ? (
                <TextField
                  variant="outlined"
                  fullWidth
                  required
                  name="content"
                  multiline
                  minRows={10}
                  maxRows={20}
                  autoComplete="off"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  error={
                    state.status === "error" && !!state.fieldErrors?.content
                  }
                  helperText={
                    state.status === "error"
                      ? state.fieldErrors?.content?.[0]
                      : "マークダウン形式で記述できます"
                  }
                  placeholder="入力してください"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        border: "none",
                      },
                    },
                  }}
                />
              ) : (
                <Box
                  sx={{
                    minHeight: 280,
                    p: 1,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    overflowX: "auto",
                  }}
                >
                  {content ? (
                    <ArticleMarkdownContent content={content} />
                  ) : (
                    <Typography color="text.secondary">
                      プレビューする内容がありません
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </Paper>
        )}
      </Box>

      {/* メイン商品 */}
      <Box mt={3} mb={2}>
        <Typography variant="subtitle1" gutterBottom>
          メイン商品
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          この記事のメインとなる商品を選択してください
        </Typography>
        <ProductSelect
          label="メイン商品"
          name="mainProductId"
          value={mainProduct}
          onChange={
            handleMainProductChange as (
              value: ProductOption | ProductOption[] | null,
            ) => void
          }
          error={state.status === "error" && !!state.fieldErrors?.mainProductId}
          helperText={
            state.status === "error"
              ? state.fieldErrors?.mainProductId?.[0]
              : null
          }
        />
      </Box>

      {/* 関連商品 */}
      <Box mt={3} mb={2}>
        <Typography variant="subtitle1" gutterBottom>
          関連商品
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          記事に関連する商品を選択してください（複数選択可）
        </Typography>
        <ProductSelect
          label="関連商品"
          name="relatedProductIds"
          multiple
          value={relatedProducts}
          onChange={(value) => setRelatedProducts(value as ProductOption[])}
          excludeIds={mainProduct ? [mainProduct.id] : []}
          error={
            state.status === "error" && !!state.fieldErrors?.relatedProductIds
          }
          helperText={
            state.status === "error"
              ? state.fieldErrors?.relatedProductIds?.[0]
              : null
          }
        />
      </Box>

      {/* 公開状態 */}
      <FormControlLabel
        control={
          <Switch
            name="isPublished"
            value="true"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
        }
        label="記事を公開する"
        sx={{ mt: 2, mb: 2 }}
      />
      {!isPublished && <input type="hidden" name="isPublished" value="false" />}

      {/* 送信ボタン */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={pending}
        sx={{ mt: 2 }}
      >
        {pending ? "作成中..." : "記事を作成"}
      </Button>
    </Box>
  );
}
