import { Button } from "@/components/Button/Button";

export type BulkApproveErrorItem = {
  // What to show for the transaction (its external ID when we have it).
  label: string;
  message: string;
};

type BulkApproveErrorProps = {
  // The overall error message from the server.
  message: string;
  // Per-transaction reasons; empty for errors that aren't about specific transactions (e.g. network).
  items: BulkApproveErrorItem[];
  onDismiss: () => void;
};

// Explains why a bulk approve failed. Nothing was approved, since the API is all-or-nothing.
export function BulkApproveError({ message, items, onDismiss }: BulkApproveErrorProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
      <div className="flex items-start justify-between gap-4">
        <p>
          <span className="font-medium">Nothing was approved.</span> {message}
        </p>
        <Button variant="ghost" onClick={onDismiss} className="shrink-0">
          Dismiss
        </Button>
      </div>
      {items.length > 0 && (
        <ul className="list-disc pl-5">
          {items.map((item) => (
            <li key={item.label}>
              <span className="font-mono text-xs">{item.label}</span>: {item.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
