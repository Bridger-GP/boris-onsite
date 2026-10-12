import type { TransactionRow } from "@/client/transactions/types";
import { SelectionCheckbox } from "@/components/SelectionCheckbox/SelectionCheckbox";
import { TransactionTableRow } from "@/components/TransactionTableRow/TransactionTableRow";

export type TransactionTableSelection = {
  isSelected: (id: string) => boolean;
  toggleRow: (id: string) => void;
  // Toggles every loaded row at once.
  toggleAll: (ids: string[]) => void;
};

type TransactionTableProps = {
  transactions: TransactionRow[];
  // When provided, the table shows a checkbox column and a "select all loaded" header checkbox.
  selection?: TransactionTableSelection;
  onEdit: (transaction: TransactionRow) => void;
  onPair: (transaction: TransactionRow) => void;
};

const HEADER_CELL_CLASSES =
  "px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500";

// Table of the loaded transactions, with optional row selection.
export function TransactionTable({
  transactions,
  selection,
  onEdit,
  onPair,
}: TransactionTableProps) {
  // Work out the header checkbox state from the loaded rows.
  const rowIds = transactions.map((transaction) => transaction.id);
  const selectedCount = selection
    ? rowIds.filter((id) => selection.isSelected(id)).length
    : 0;
  const areAllSelected =
    rowIds.length > 0 && selectedCount === rowIds.length;
  const areSomeSelected =
    selectedCount > 0 && !areAllSelected;

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
      <table className="w-full text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
          <tr>
            {selection && (
              <th className={`${HEADER_CELL_CLASSES} w-10`}>
                <SelectionCheckbox
                  checked={areAllSelected}
                  indeterminate={areSomeSelected}
                  onChange={() => selection.toggleAll(rowIds)}
                  ariaLabel="Select all loaded transactions"
                />
              </th>
            )}
            <th className={HEADER_CELL_CLASSES}>External ID</th>
            <th className={HEADER_CELL_CLASSES}>Date</th>
            <th className={`${HEADER_CELL_CLASSES} text-right`}>Amount</th>
            <th className={HEADER_CELL_CLASSES}>Description</th>
            <th className={HEADER_CELL_CLASSES}>State</th>
            <th className={HEADER_CELL_CLASSES}>Category</th>
            <th className={HEADER_CELL_CLASSES}>Payee</th>
            <th className={HEADER_CELL_CLASSES}>Paired</th>
            <th className={`${HEADER_CELL_CLASSES} text-right`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <TransactionTableRow
              key={transaction.id}
              transaction={transaction}
              selection={
                selection && {
                  isSelected: selection.isSelected(transaction.id),
                  onToggle: () => selection.toggleRow(transaction.id),
                }
              }
              onEdit={onEdit}
              onPair={onPair}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
