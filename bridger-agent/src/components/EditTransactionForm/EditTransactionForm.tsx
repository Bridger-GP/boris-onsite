import type { ApiPayee, NamedEntity } from "@/client/transactions/apiTypes";
import { EntitySelect } from "@/components/EntitySelect/EntitySelect";
import { PayeeField } from "@/components/PayeeField/PayeeField";

type EditTransactionFormProps = {
  // Needed to create new payees.
  clientId: string;
  categories: NamedEntity[];
  payees: ApiPayee[];
  categoryId: string | null;
  payeeId: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  onPayeeChange: (payeeId: string) => void;
  // Split transactions get their categories from their splits, so the category can't be set here.
  isSplit: boolean;
  disabled: boolean;
};

// Category and payee pickers for the Edit dialog.
export function EditTransactionForm({
  clientId,
  categories,
  payees,
  categoryId,
  payeeId,
  onCategoryChange,
  onPayeeChange,
  isSplit,
  disabled,
}: EditTransactionFormProps) {
  return (
    <div className="grid grid-cols-2 items-start gap-4">
      {isSplit ? (
        <div className="flex flex-col gap-1">
          <span className="font-medium text-gray-700 dark:text-gray-300">Category</span>
          <span className="py-1.5 text-gray-500">Split across multiple categories</span>
        </div>
      ) : (
        <EntitySelect
          label="Category"
          options={categories}
          value={categoryId}
          placeholder="Select a category"
          onChange={onCategoryChange}
          disabled={disabled}
        />
      )}
      <PayeeField
        clientId={clientId}
        payees={payees}
        payeeId={payeeId}
        onChange={onPayeeChange}
        disabled={disabled}
      />
    </div>
  );
}
