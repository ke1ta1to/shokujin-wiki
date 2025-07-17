import { z } from "zod";

/**
 * ページネーションのデフォルト値
 */
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

/**
 * ページネーションパラメータのスキーマ
 */
const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_LIMIT)
    .optional()
    .default(DEFAULT_LIMIT),
});

/**
 * ページネーションのURLパラメータ型
 */
export interface PaginationSearchParams {
  page?: string;
  limit?: string;
}

/**
 * ページネーション情報の戻り値型
 */
export interface PaginationResult {
  currentPage: number;
  limit: number;
  skip: number;
  take: number;
}

/**
 * URLパラメータからページネーション情報を取得
 */
export function getPaginationParams(
  searchParams: PaginationSearchParams,
): PaginationResult {
  const { page: currentPage, limit } = paginationSchema.parse({
    page: searchParams.page,
    limit: searchParams.limit,
  });

  const skip = (currentPage - 1) * limit;

  return {
    currentPage,
    limit,
    skip,
    take: limit,
  };
}
