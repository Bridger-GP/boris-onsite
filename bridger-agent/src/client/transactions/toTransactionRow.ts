import type { ApiTransaction } from "./apiTypes";
import type { TransactionRow } from "./types";

// Converts an API transaction into the table's view model, resolving category/payee IDs to names.
export function toTransactionRow(
  transaction: ApiTransaction,
  categoryNamesById: Map<string, string>,
  payeeNamesById: Map<string, string>,
): TransactionRow {
  return {
    id: transaction.id,
    externalId: transaction.externalId,
    date: transaction.date,
    amountCents: transaction.amountCents,
    description: transaction.description,
    state: transaction.state,
    categoryName: lookupName(categoryNamesById, transaction.categoryId),
    payeeName: lookupName(payeeNamesById, transaction.payeeId),
    isPaired: transaction.pairTransactionId !== null,
  };
}

// Returns the name for an optional ID, or null if the ID is missing or unknown.
function lookupName(namesById: Map<string, string>, id: string | null): string | null {
  if (id === null) {
    return null;
  }
  return namesById.get(id) ?? null;
}
