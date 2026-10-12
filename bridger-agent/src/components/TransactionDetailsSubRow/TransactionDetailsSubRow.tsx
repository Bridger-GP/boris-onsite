import type { ReferenceData, TransactionRow } from "@/client/transactions/types";
import { PairDetails } from "@/components/PairDetails/PairDetails";
import { SplitDetails } from "@/components/SplitDetails/SplitDetails";

type TransactionDetailsSubRowProps = {
  transaction: TransactionRow;
  referenceData: ReferenceData;
  // Number of columns in the main table, so the sub-row spans the full width.
  columnCount: number;
};

// Expanded sub-row under a transaction: its paired transaction, or its split lines.
// Pairs and splits are mutually exclusive, so at most one applies.
export function TransactionDetailsSubRow({ transaction, referenceData, columnCount }: TransactionDetailsSubRowProps) {
  let details = null;
  if (transaction.pairTransactionId !== null) {
    details = <PairDetails pairTransactionId={transaction.pairTransactionId} referenceData={referenceData} />;
  } else if (transaction.isSplit) {
    details = <SplitDetails splits={transaction.splits} referenceData={referenceData} />;
  }

  return (
    <tr className="border-b border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <td colSpan={columnCount} className="px-6 py-3">
        {details}
      </td>
    </tr>
  );
}
