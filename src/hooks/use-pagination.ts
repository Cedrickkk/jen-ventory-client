import type { PageParamsSchema } from "@/features/api/schema/pagination";
import { useCallback, useState } from "react";

type UsePaginationOptions = {
  initialPage?: number;
  initialSize?: number;
  initialSort?: string[];
};

export function getPageNumbers(
  currentPage: number,
  totalPages: number,
): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }

  pages.push(1);

  if (currentPage > 3) {
    pages.push("ellipsis");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) {
    pages.push("ellipsis");
  }

  pages.push(totalPages);

  return pages;
}

export function usePagination(options: UsePaginationOptions = {}) {
  const { initialPage = 1, initialSize = 10, initialSort } = options;

  const [pageParams, setPageParams] = useState<
    Required<Pick<PageParamsSchema, "page" | "size">> &
      Pick<PageParamsSchema, "sort">
  >({
    page: initialPage,
    size: initialSize,
    sort: initialSort,
  });

  const setPage = useCallback((page: number) => {
    setPageParams((prev) => ({ ...prev, page }));
  }, []);

  const setSize = useCallback((size: number) => {
    setPageParams((prev) => ({ ...prev, page: 1, size }));
  }, []);

  const setSort = useCallback((sort: string[] | undefined) => {
    setPageParams((prev) => ({ ...prev, sort }));
  }, []);

  const nextPage = useCallback((totalPages: number) => {
    setPageParams((prev) => ({
      ...prev,
      page: Math.min(prev.page + 1, totalPages),
    }));
  }, []);

  const prevPage = useCallback(() => {
    setPageParams((prev) => ({
      ...prev,
      page: Math.max(prev.page - 1, 1),
    }));
  }, []);

  return {
    pageParams,
    setPage,
    setSize,
    setSort,
    nextPage,
    prevPage,
  };
}
