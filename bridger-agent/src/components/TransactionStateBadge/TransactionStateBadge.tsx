import {
  TransactionState,
  type TransactionState as TransactionStateValue,
} from "@/server/modules/transactions/transactionState";

type TransactionStateBadgeProps = {
  state: TransactionStateValue;
};

const STATE_LABELS: Record<TransactionStateValue, string> = {
  [TransactionState.INGESTED]: "Ingested",
  [TransactionState.READY_FOR_REVIEW]: "Ready for review",
  [TransactionState.PROBLEM]: "Problem",
  [TransactionState.REVIEWED]: "Reviewed",
  [TransactionState.WRITTEN]: "Written",
  [TransactionState.IGNORED]: "Ignored",
};

const STATE_CLASSES: Record<TransactionStateValue, string> = {
  [TransactionState.INGESTED]: "bg-gray-100 text-gray-700",
  [TransactionState.READY_FOR_REVIEW]: "bg-amber-100 text-amber-800",
  [TransactionState.PROBLEM]: "bg-red-100 text-red-800",
  [TransactionState.REVIEWED]: "bg-green-100 text-green-800",
  [TransactionState.WRITTEN]: "bg-blue-100 text-blue-800",
  [TransactionState.IGNORED]: "bg-gray-100 text-gray-500 line-through",
};

// Colored pill showing a transaction's lifecycle state.
export function TransactionStateBadge({ state }: TransactionStateBadgeProps) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${STATE_CLASSES[state]}`}
    >
      {STATE_LABELS[state]}
    </span>
  );
}
