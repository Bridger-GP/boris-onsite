import { formatAmount, formatDate } from "@/client/transactions/format";
import type { TransactionRow } from "@/client/transactions/types";
import { ExpandToggleButton } from "@/components/ExpandToggleButton/ExpandToggleButton";
import { OptionalText } from "@/components/OptionalText/OptionalText";
import { RowActions } from "@/components/RowActions/RowActions";
import { SelectionCheckbox } from "@/components/SelectionCheckbox/SelectionCheckbox";
import { TransactionStateBadge } from "@/components/TransactionStateBadge/TransactionStateBadge";

type TransactionMainRowProps = {
  transaction: TransactionRow;
  // When provided, the row renders a leading selection checkbox.
  selection?: {
    isSelected: boolean;
    onToggle: () => void;
  };
  onEdit: (transaction: TransactionRow) => void;
  onPair: (transaction: TransactionRow) => void;
  // Whether the row has a details sub-row (paired or split); shows the toggle when true.
  hasDetails: boolean;
  detailsLabel: string;
  isExpanded: boolean;
  onToggleExpanded: () => void;
};

const CELL_CLASSES = "px-3 py-2 align-middle";

// The cells of one transaction row: data columns, row actions and the details toggle.
export function TransactionMainRow({
  transaction,
  selection,
  onEdit,
  onPair,
  hasDetails,
  detailsLabel,
  isExpanded,
  onToggleExpanded,
}: TransactionMainRowProps) {
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
        <RowActions
          isPaired={transaction.isPaired}
          onEdit={() => onEdit(transaction)}
          onPair={() => onPair(transaction)}
        />
      </td>
      <td className={`${CELL_CLASSES} w-10 text-right`}>
        {hasDetails && (
          <ExpandToggleButton
            isExpanded={isExpanded}
            onToggle={onToggleExpanded}
            label={detailsLabel}
          />
        )}
      </td>
    </tr>
  );
}
