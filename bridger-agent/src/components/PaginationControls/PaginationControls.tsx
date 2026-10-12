import { Button } from "@/components/Button/Button";

type PaginationControlsProps = {
  // 1-based page number.
  page: number;
  pageCount: number;
  totalCount: number;
  onPageChange: (page: number) => void;
};

// Prev/Next controls with a "Page X of Y" summary.
export function PaginationControls({
  page,
  pageCount,
  totalCount,
  onPageChange,
}: PaginationControlsProps) {
  const isFirstPage = page <= 1;
  const isLastPage = page >= pageCount;

  return (
    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
      <span>
        Page {page} of {pageCount} · {totalCount} total
      </span>
      <div className="flex gap-2">
        <Button disabled={isFirstPage} onClick={() => onPageChange(page - 1)}>
          Previous
        </Button>
        <Button disabled={isLastPage} onClick={() => onPageChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
