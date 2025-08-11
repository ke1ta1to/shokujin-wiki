"use client";

import type { SelectChangeEvent } from "@mui/material";
import {
  FormControl,
  MenuItem,
  Pagination as MuiPagination,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export interface PaginationProps {
  totalCount: number;
  currentPage: number;
  limit: number;
  /**
   * 表示件数の選択肢
   * @default [10, 20, 50, 100]
   */
  limitOptions?: readonly number[];
  /**
   * 表示件数選択を表示するか
   * @default true
   */
  showLimitSelector?: boolean;
  /**
   * 合計件数を表示するか
   * @default true
   */
  showTotalCount?: boolean;
}

const DEFAULT_LIMIT_OPTIONS = [10, 20, 50, 100] as const;

export function Pagination({
  totalCount,
  currentPage,
  limit,
  limitOptions = DEFAULT_LIMIT_OPTIONS,
  showLimitSelector = true,
  showTotalCount = true,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(totalCount / limit);

  const createQueryString = useCallback(
    (params: Record<string, string>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          newSearchParams.set(key, value);
        } else {
          newSearchParams.delete(key);
        }
      });

      return newSearchParams.toString();
    },
    [searchParams],
  );

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    const queryString = createQueryString({
      page: page.toString(),
    });
    router.push(pathname + (queryString ? "?" + queryString : ""));
  };

  const handleLimitChange = (event: SelectChangeEvent<number>) => {
    const queryString = createQueryString({
      page: "1", // ページを1にリセット
      limit: event.target.value.toString(),
    });
    router.push(pathname + (queryString ? "?" + queryString : ""));
  };

  if (totalCount === 0) {
    return null;
  }

  return (
    <Stack spacing={2} alignItems="center">
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        showFirstButton
        showLastButton
      />
      {(showLimitSelector || showTotalCount) && (
        <Stack direction="row" spacing={2} alignItems="center">
          {showLimitSelector && (
            <>
              <Typography variant="body2" color="text.secondary">
                表示件数:
              </Typography>
              <FormControl size="small">
                <Select value={limit} onChange={handleLimitChange} displayEmpty>
                  {limitOptions.map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}件
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
          {showTotalCount && (
            <Typography variant="body2" color="text.secondary">
              全{totalCount.toLocaleString()}件
            </Typography>
          )}
        </Stack>
      )}
    </Stack>
  );
}
