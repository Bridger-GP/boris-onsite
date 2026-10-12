import { getPairBlocker } from "@/client/transactions/editability";
import type { TransactionRow } from "@/client/transactions/types";
import { PairCandidateRow } from "@/components/PairCandidateRow/PairCandidateRow";

type PairCandidateTableProps = {
  candidates: TransactionRow[];
  selectedId: string | null;
  onSelect: (transactionId: string) => void;
};

const HEADER_CELL_CLASSES = "px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500";

// Simplified, single-select transaction table for choosing the other side of a pair.
export function PairCandidateTable({ candidates, selectedId, onSelect }: PairCandidateTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
      <table className="w-full">
        <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
          <tr>
            <th className={`${HEADER_CELL_CLASSES} w-10`} aria-label="Select" />
            <th className={HEADER_CELL_CLASSES}>Date</th>
            <th className={HEADER_CELL_CLASSES}>Description</th>
            <th className={`${HEADER_CELL_CLASSES} text-right`}>Amount</th>
            <th className={HEADER_CELL_CLASSES}>State</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <PairCandidateRow
              key={candidate.id}
              candidate={candidate}
              isSelected={candidate.id === selectedId}
              blocker={getPairBlocker(candidate)}
              onSelect={() => onSelect(candidate.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
