import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { useCallback } from "react";

export const paginationParsers = {
  page: parseAsInteger.withDefault(1),
  size: parseAsInteger.withDefault(10),
  sort: parseAsArrayOf(parseAsString).withDefault([]),
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

type UsePaginationOptions = {
  initialPage?: number;
  initialSize?: number;
  initialSort?: string[];
};

export function usePagination(options: UsePaginationOptions = {}) {
  const { initialPage = 1, initialSize = 10, initialSort = [] } = options;

  const [pageParams, setPageParams] = useQueryStates(
    {
      page: parseAsInteger.withDefault(initialPage),
      size: parseAsInteger.withDefault(initialSize),
      sort: parseAsArrayOf(parseAsString).withDefault(initialSort),
    },
    { history: "push" },
  );

  const setPage = useCallback(
    (page: number) => setPageParams({ page }),
    [setPageParams],
  );

  const setSize = useCallback(
    (size: number) => setPageParams({ page: 1, size }),
    [setPageParams],
  );

  const setSort = useCallback(
    (sort: string[]) => setPageParams({ sort }),
    [setPageParams],
  );

  const nextPage = useCallback(
    (totalPages: number) =>
      setPageParams((prev) => ({
        page: Math.min(prev.page + 1, totalPages),
      })),
    [setPageParams],
  );

  const prevPage = useCallback(
    () =>
      setPageParams((prev) => ({
        page: Math.max(prev.page - 1, 1),
      })),
    [setPageParams],
  );

  return {
    pageParams,
    setPage,
    setSize,
    setSort,
    nextPage,
    prevPage,
  };
}
