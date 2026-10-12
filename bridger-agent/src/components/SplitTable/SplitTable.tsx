import type { ApiPayee, NamedEntity } from "@/client/transactions/apiTypes";
import { formatAmount } from "@/client/transactions/format";
import type { SplitDraftLine } from "@/client/transactions/hooks/useSplitEditor";
import { SplitLineRow } from "@/components/SplitLineRow/SplitLineRow";

type SplitTableProps = {
  lines: SplitDraftLine[];
  categories: NamedEntity[];
  payees: ApiPayee[];
  // Unsigned cents: what the lines must add up to, and how much is still unallocated.
  totalCents: number;
  remainingCents: number;
  onChangeLine: (key: string, changes: Partial<Omit<SplitDraftLine, "key">>) => void;
  onRemoveLine: (key: string) => void;
  disabled: boolean;
};

const HEADER_CELL_CLASSES = "pb-1 pr-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500";

// Table of split lines, with a footer showing how much of the total is still unallocated.
export function SplitTable({
  lines,
  categories,
  payees,
  totalCents,
  remainingCents,
  onChangeLine,
  onRemoveLine,
  disabled,
}: SplitTableProps) {
  const remainingClasses = remainingCents === 0 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-300";

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th className={HEADER_CELL_CLASSES}>Category</th>
          <th className={HEADER_CELL_CLASSES}>Payee</th>
          <th className={`${HEADER_CELL_CLASSES} text-right`}>Amount</th>
          <th className="w-10" aria-label="Actions" />
        </tr>
      </thead>
      <tbody>
        {lines.map((line, index) => (
          <SplitLineRow
            key={line.key}
            line={line}
            lineNumber={index + 1}
            categories={categories}
            payees={payees}
            onChange={(changes) => onChangeLine(line.key, changes)}
            onRemove={() => onRemoveLine(line.key)}
            disabled={disabled}
          />
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={2} className="pt-2 text-right text-gray-500">
            Total {formatAmount(totalCents)} · Remaining
          </td>
          <td className={`pt-2 pr-2 text-right font-medium tabular-nums ${remainingClasses}`}>
            {formatAmount(remainingCents)}
          </td>
          <td />
        </tr>
      </tfoot>
    </table>
  );
}
