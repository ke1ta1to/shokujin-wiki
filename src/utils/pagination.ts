import { z } from "zod";

/**
 * ページネーションのデフォルト値
 */
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 500;

/**
 * ページネーションパラメータのスキーマを生成
 */
function createPaginationSchema(defaultLimit: number = DEFAULT_LIMIT) {
  return z.object({
    page: z.coerce.number().int().min(1).optional().default(DEFAULT_PAGE),
    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(MAX_LIMIT)
      .optional()
      .default(defaultLimit),
  });
}

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
 * ページネーションのオプション
 */
export interface PaginationOptions {
  defaultLimit?: number;
}

/**
 * URLパラメータからページネーション情報を取得
 */
export function getPaginationParams(
  searchParams: PaginationSearchParams,
  options?: PaginationOptions,
): PaginationResult {
  const defaultLimit = options?.defaultLimit ?? DEFAULT_LIMIT;
  const schema = createPaginationSchema(defaultLimit);

  const { page: currentPage, limit } = schema.parse({
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
