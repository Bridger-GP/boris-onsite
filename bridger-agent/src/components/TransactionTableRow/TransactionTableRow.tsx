import { useState } from "react";
import type { ReferenceData, TransactionRow } from "@/client/transactions/types";
import { TransactionDetailsSubRow } from "@/components/TransactionDetailsSubRow/TransactionDetailsSubRow";
import { TransactionMainRow } from "@/components/TransactionMainRow/TransactionMainRow";

type TransactionTableRowProps = {
  transaction: TransactionRow;
  // When provided, the row renders a leading selection checkbox.
  selection?: {
    isSelected: boolean;
    onToggle: () => void;
  };
  onEdit: (transaction: TransactionRow) => void;
  onPair: (transaction: TransactionRow) => void;
  // Used by the details sub-row to show account, category and payee names.
  referenceData: ReferenceData;
  // Total columns in the table, so the details sub-row can span all of them.
  columnCount: number;
};

// A single transaction in the review table. Paired or split transactions get a toggle
// that shows a details sub-row underneath (the paired transaction, or the split lines).
export function TransactionTableRow({
  transaction,
  selection,
  onEdit,
  onPair,
  referenceData,
  columnCount,
}: TransactionTableRowProps) {
  // Purely visual, so it lives here; rows are keyed by ID, so it survives "load more".
  const [isExpanded, setIsExpanded] = useState(false);

  const hasDetails = transaction.isPaired || transaction.isSplit;
  const detailsLabel = transaction.isPaired ? "paired transaction" : "split details";

  return (
    <>
      <TransactionMainRow
        transaction={transaction}
        selection={selection}
        onEdit={onEdit}
        onPair={onPair}
        hasDetails={hasDetails}
        detailsLabel={detailsLabel}
        isExpanded={isExpanded}
        onToggleExpanded={() => setIsExpanded((previous) => !previous)}
      />
      {/* Re-checks hasDetails so the sub-row disappears if, say, the transaction is unpaired while expanded. */}
      {isExpanded && hasDetails && (
        <TransactionDetailsSubRow transaction={transaction} referenceData={referenceData} columnCount={columnCount} />
      )}
    </>
  );
}
