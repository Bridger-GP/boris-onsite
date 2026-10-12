import type { ApiTransaction } from "./apiTypes";
import type { ReferenceData, TransactionRow } from "./types";

// Converts an API transaction into the table's view model, resolving category/payee IDs to names.
export function toTransactionRow(
  transaction: ApiTransaction,
  referenceData: ReferenceData,
): TransactionRow {
  return {
    id: transaction.id,
    accountId: transaction.accountId,
    externalId: transaction.externalId,
    date: transaction.date,
    amountCents: transaction.amountCents,
    description: transaction.description,
    state: transaction.state,
    categoryId: transaction.categoryId,
    categoryName: lookupName(referenceData.categoryNamesById, transaction.categoryId),
    payeeId: transaction.payeeId,
    payeeName: lookupName(referenceData.payeeNamesById, transaction.payeeId),
    isPaired: transaction.pairTransactionId !== null,
    pairTransactionId: transaction.pairTransactionId,
    isSplit: transaction.splits.length > 0,
    splits: transaction.splits,
  };
}

// Returns the name for an optional ID, or null if the ID is missing or unknown.
export function lookupName(namesById: Map<string, string>, id: string | null): string | null {
  if (id === null) {
    return null;
  }
  return namesById.get(id) ?? null;
}
