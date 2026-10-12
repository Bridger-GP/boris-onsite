import type { ApiPayee, NamedEntity } from "@/client/transactions/apiTypes";
import type { SplitDraftLine } from "@/client/transactions/hooks/useSplitEditor";
import { Button } from "@/components/Button/Button";
import { EntitySelect } from "@/components/EntitySelect/EntitySelect";

type SplitLineRowProps = {
  line: SplitDraftLine;
  // 1-based, for accessible labels ("Line 2 category").
  lineNumber: number;
  categories: NamedEntity[];
  payees: ApiPayee[];
  onChange: (changes: Partial<Omit<SplitDraftLine, "key">>) => void;
  onRemove: () => void;
  disabled: boolean;
};

// One editable line in the split table: category, optional payee, amount, and a remove button.
export function SplitLineRow({
  line,
  lineNumber,
  categories,
  payees,
  onChange,
  onRemove,
  disabled,
}: SplitLineRowProps) {
  return (
    <tr className="border-b border-gray-100 dark:border-gray-800">
      <td className="py-1.5 pr-2">
        <EntitySelect
          label={`Line ${lineNumber} category`}
          hideLabel
          options={categories}
          value={line.categoryId}
          placeholder="Select a category"
          onChange={(categoryId) => onChange({ categoryId })}
          disabled={disabled}
        />
      </td>
      <td className="py-1.5 pr-2">
        <EntitySelect
          label={`Line ${lineNumber} payee`}
          hideLabel
          options={payees}
          value={line.payeeId}
          placeholder="No payee"
          allowEmpty
          onChange={(payeeId) => onChange({ payeeId })}
          disabled={disabled}
        />
      </td>
      <td className="py-1.5 pr-2">
        <input
          className="w-28 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-right tabular-nums disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-900 dark:disabled:bg-gray-800"
          inputMode="decimal"
          placeholder="0.00"
          aria-label={`Line ${lineNumber} amount`}
          value={line.amountInput}
          onChange={(event) => onChange({ amountInput: event.target.value })}
          disabled={disabled}
        />
      </td>
      <td className="py-1.5 text-right">
        {!disabled && (
          <Button variant="ghost" onClick={onRemove} aria-label={`Remove line ${lineNumber}`}>
            ✕
          </Button>
        )}
      </td>
    </tr>
  );
}
