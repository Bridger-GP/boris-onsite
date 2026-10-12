import { formatAmount, formatDate } from "@/client/transactions/format";
import type { TransactionRow } from "@/client/transactions/types";

type TransactionSummaryProps = {
  transaction: TransactionRow;
};

// Compact read-only summary of a transaction, shown at the top of the per-row dialogs.
export function TransactionSummary({ transaction }: TransactionSummaryProps) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-md bg-gray-50 p-3 dark:bg-gray-800">
      <dt className="text-gray-500">External ID</dt>
      <dd className="font-mono text-xs leading-5">{transaction.externalId}</dd>
      <dt className="text-gray-500">Date</dt>
      <dd>{formatDate(transaction.date)}</dd>
      <dt className="text-gray-500">Amount</dt>
      <dd className="tabular-nums">{formatAmount(transaction.amountCents)}</dd>
      <dt className="text-gray-500">Description</dt>
      <dd>{transaction.description}</dd>
    </dl>
  );
}
