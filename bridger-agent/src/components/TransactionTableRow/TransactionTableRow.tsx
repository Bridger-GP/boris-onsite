import { formatAmount, formatDate } from "@/client/transactions/format";
import type { TransactionRow } from "@/client/transactions/types";
import { OptionalText } from "@/components/OptionalText/OptionalText";
import { PairedIndicator } from "@/components/PairedIndicator/PairedIndicator";
import { RowActions } from "@/components/RowActions/RowActions";
import { SelectionCheckbox } from "@/components/SelectionCheckbox/SelectionCheckbox";
import { TransactionStateBadge } from "@/components/TransactionStateBadge/TransactionStateBadge";

type TransactionTableRowProps = {
  transaction: TransactionRow;
  // When provided, the row renders a leading selection checkbox.
  selection?: {
    isSelected: boolean;
    onToggle: () => void;
  };
  onEdit: (transaction: TransactionRow) => void;
  onPair: (transaction: TransactionRow) => void;
};

const CELL_CLASSES = "px-3 py-2 align-middle";

// A single transaction row in the review table.
export function TransactionTableRow({
  transaction,
  selection,
  onEdit,
  onPair,
}: TransactionTableRowProps) {
  const isNegative = transaction.amountCents < 0;
  const amountClasses = isNegative ? "text-red-600" : "text-gray-900 dark:text-gray-100";
  const rowClasses = selection?.isSelected
    ? "bg-blue-50 dark:bg-blue-950"
    : "hover:bg-gray-50 dark:hover:bg-gray-900";

  return (
    <tr className={`border-b border-gray-100 dark:border-gray-800 ${rowClasses}`}>
      {selection && (
        <td className={CELL_CLASSES}>
          <SelectionCheckbox
            checked={selection.isSelected}
            onChange={selection.onToggle}
            ariaLabel={`Select transaction ${transaction.externalId}`}
          />
        </td>
      )}
      <td className={`${CELL_CLASSES} font-mono text-xs text-gray-600 dark:text-gray-400`}>
        {transaction.externalId}
      </td>
      <td className={`${CELL_CLASSES} whitespace-nowrap`}>
        {formatDate(transaction.date)}
      </td>
      <td className={`${CELL_CLASSES} whitespace-nowrap text-right tabular-nums ${amountClasses}`}>
        {formatAmount(transaction.amountCents)}
      </td>
      <td className={CELL_CLASSES}>{transaction.description}</td>
      <td className={CELL_CLASSES}>
        <TransactionStateBadge state={transaction.state} />
      </td>
      <td className={CELL_CLASSES}>
        <OptionalText value={transaction.categoryName} />
      </td>
      <td className={CELL_CLASSES}>
        <OptionalText value={transaction.payeeName} />
      </td>
      <td className={CELL_CLASSES}>
        <PairedIndicator isPaired={transaction.isPaired} />
      </td>
      <td className={CELL_CLASSES}>
        <RowActions
          isPaired={transaction.isPaired}
          onEdit={() => onEdit(transaction)}
          onPair={() => onPair(transaction)}
        />
      </td>
    </tr>
  );
}
