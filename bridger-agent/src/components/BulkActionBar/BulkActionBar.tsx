import { Button } from "@/components/Button/Button";

type BulkActionBarProps = {
  selectedCount: number;
  onApprove: () => void;
  onClear: () => void;
};

// Toolbar for actions on the selected rows. Renders nothing when no rows are selected.
export function BulkActionBar({
  selectedCount,
  onApprove,
  onClear,
}: BulkActionBarProps) {
  if (selectedCount === 0) {
    return null;
  }

  const rowLabel = selectedCount === 1 ? "transaction" : "transactions";

  return (
    <div className="flex items-center justify-between h-9 gap-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-0 text-sm dark:border-blue-900 dark:bg-blue-950">
      <span className="font-medium text-blue-900 dark:text-blue-100">
        {selectedCount} {rowLabel} selected
      </span>
      <div className="flex gap-2">
        <Button variant="ghost" onClick={onClear}>
          Clear selection
        </Button>
        <Button variant="primary" onClick={onApprove}>
          Approve selected
        </Button>
      </div>
    </div>
  );
}
