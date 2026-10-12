import { useMemo, useState } from "react";

export type Pagination<T> = {
  pageItems: T[];
  // 1-based page number.
  page: number;
  pageCount: number;
  totalCount: number;
  setPage: (page: number) => void;
};

// Client-side pagination over an in-memory list.
// The returned page is clamped to the valid range, so shrinking `items` never leaves you on an empty page.
export function usePagination<T>(items: T[], pageSize: number): Pagination<T> {
  const [requestedPage, setRequestedPage] = useState(1);

  const totalCount = items.length;
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));
  const page = Math.min(Math.max(requestedPage, 1), pageCount);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  return { pageItems, page, pageCount, totalCount, setPage: setRequestedPage };
}
