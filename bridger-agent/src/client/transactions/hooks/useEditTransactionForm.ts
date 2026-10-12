import { useState } from "react";
import { isEditableState } from "../editability";
import type { TransactionRow } from "../types";

// Form state for the Edit dialog: the chosen category and payee, starting from the transaction's current values.
export function useEditTransactionForm(transaction: TransactionRow) {
  const [categoryId, setCategoryId] = useState<string | null>(transaction.categoryId);
  const [payeeId, setPayeeId] = useState<string | null>(transaction.payeeId);

  const isEditable = isEditableState(transaction.state);

  // The server requires a category, a pair, or a split before a transaction can be submitted.
  const needsCategory = !transaction.isPaired && !transaction.isSplit;
  const hasRequiredCategory = !needsCategory || categoryId !== null;
  const canSubmit = isEditable && hasRequiredCategory;

  // A split transaction's categories live on its lines; sending one would put it back on the parent.
  const categoryIdToSubmit = transaction.isSplit ? null : categoryId;

  return {
    categoryId,
    categoryIdToSubmit,
    setCategoryId,
    payeeId,
    setPayeeId,
    isEditable,
    canSubmit,
  };
}
