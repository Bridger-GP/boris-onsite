import type { TransactionState } from "@/server/modules/transactions/transactionState";
import type { ApiPayee, ApiSplit, NamedEntity } from "./apiTypes";

// View model for a single row in the transaction review tables.
// Mirrors the Prisma Transaction model, flattened for display (names alongside relation IDs).
export type TransactionRow = {
  id: string;
  accountId: string;
  externalId: string;
  // Calendar date, "YYYY-MM-DD" (as returned by the API).
  date: string;
  // Signed amount in cents (negative = money out).
  amountCents: number;
  description: string;
  state: TransactionState;
  categoryId: string | null;
  categoryName: string | null;
  payeeId: string | null;
  payeeName: string | null;
  // True when the transaction is paired with another one (e.g. two sides of a transfer).
  isPaired: boolean;
  // The other side of the pair, if any.
  pairTransactionId: string | null;
  // True when the transaction is split across multiple categories.
  isSplit: boolean;
  splits: ApiSplit[];
};

// A client's accounts, categories and payees: full lists for dropdowns, plus id -> name lookups for display.
export type ReferenceData = {
  // The client these lists belong to (needed to create new payees).
  clientId: string;
  accounts: NamedEntity[];
  categories: NamedEntity[];
  payees: ApiPayee[];
  categoryNamesById: Map<string, string>;
  payeeNamesById: Map<string, string>;
};
