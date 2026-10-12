import { Button } from "@/components/Button/Button";

type LoadMoreFooterProps = {
  loadedCount: number;
  totalCount: number;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
};

// "Showing N of M" summary with a button to fetch the next batch.
export function LoadMoreFooter({
  loadedCount,
  totalCount,
  hasMore,
  loadingMore,
  onLoadMore,
}: LoadMoreFooterProps) {
  return (
    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
      <span>
        Showing {loadedCount} of {totalCount}
      </span>
      {hasMore && (
        <Button disabled={loadingMore} onClick={onLoadMore}>
          {loadingMore ? "Loading…" : "Load more"}
        </Button>
      )}
    </div>
  );
}
