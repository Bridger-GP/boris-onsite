import { formatAmount, formatDate } from "@/client/transactions/format";
import type { TransactionRow } from "@/client/transactions/types";
import { TransactionStateBadge } from "@/components/TransactionStateBadge/TransactionStateBadge";

type PairCandidateRowProps = {
  candidate: TransactionRow;
  isSelected: boolean;
  // Why this transaction can't be picked, or null if it can.
  blocker: string | null;
  onSelect: () => void;
};

const CELL_CLASSES = "px-3 py-2 align-middle";

// One row in the pair picker: a radio button plus the essentials of a candidate transaction.
export function PairCandidateRow({ candidate, isSelected, blocker, onSelect }: PairCandidateRowProps) {
  const isDisabled = blocker !== null;
  const amountClasses = candidate.amountCents < 0 ? "text-red-600" : "";

  let rowClasses = "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800";
  if (isDisabled) {
    rowClasses = "text-gray-400";
  } else if (isSelected) {
    rowClasses = "bg-blue-50 dark:bg-blue-950";
  }

  return (
    <tr
      className={`border-b border-gray-100 dark:border-gray-800 ${rowClasses}`}
      // The whole row is a click target, not just the small radio button.
      onClick={isDisabled ? undefined : onSelect}
    >
      <td className={CELL_CLASSES}>
        <input
          type="radio"
          name="pair-candidate"
          className="h-4 w-4 accent-blue-600"
          checked={isSelected}
          disabled={isDisabled}
          onChange={onSelect}
          aria-label={`Pair with ${candidate.externalId}`}
        />
      </td>
      <td className={`${CELL_CLASSES} whitespace-nowrap`}>{formatDate(candidate.date)}</td>
      <td className={CELL_CLASSES}>{candidate.description}</td>
      <td className={`${CELL_CLASSES} whitespace-nowrap text-right tabular-nums ${isDisabled ? "" : amountClasses}`}>
        {formatAmount(candidate.amountCents)}
      </td>
      <td className={CELL_CLASSES}>
        {blocker === null ? <TransactionStateBadge state={candidate.state} /> : <span className="text-xs">{blocker}</span>}
      </td>
    </tr>
  );
}
