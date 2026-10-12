import type { ApiSplit } from "@/client/transactions/apiTypes";
import { formatAmount } from "@/client/transactions/format";
import { lookupName } from "@/client/transactions/toTransactionRow";
import type { ReferenceData } from "@/client/transactions/types";
import { OptionalText } from "@/components/OptionalText/OptionalText";

type SplitDetailsProps = {
  splits: ApiSplit[];
  referenceData: ReferenceData;
};

const HEADER_CELL_CLASSES = "py-1 pr-6 text-left text-xs font-semibold uppercase tracking-wide text-gray-500";
const CELL_CLASSES = "py-1 pr-6";

// Read-only list of a transaction's split lines, shown in its expanded sub-row.
export function SplitDetails({ splits, referenceData }: SplitDetailsProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-medium text-gray-700 dark:text-gray-300">Split into {splits.length} lines</span>
      <table>
        <thead>
          <tr>
            <th className={HEADER_CELL_CLASSES}>Category</th>
            <th className={HEADER_CELL_CLASSES}>Payee</th>
            <th className={`${HEADER_CELL_CLASSES} text-right`}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {splits.map((split) => (
            <tr key={split.id}>
              <td className={CELL_CLASSES}>
                <OptionalText value={lookupName(referenceData.categoryNamesById, split.categoryId)} />
              </td>
              <td className={CELL_CLASSES}>
                <OptionalText value={lookupName(referenceData.payeeNamesById, split.payeeId)} />
              </td>
              <td className={`${CELL_CLASSES} text-right tabular-nums ${split.amountCents < 0 ? "text-red-600" : ""}`}>
                {formatAmount(split.amountCents)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

