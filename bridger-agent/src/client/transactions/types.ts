import type { TransactionState } from "@/server/modules/transactions/transactionState";

// View model for a single row in the transaction review tables.
// Mirrors the Prisma Transaction model, flattened for display (names instead of relation IDs).
export type TransactionRow = {
  id: string;
  externalId: string;
  // ISO date string (midnight UTC), e.g. "2026-09-14T00:00:00.000Z".
  date: string;
  // Signed amount in cents (negative = money out).
  amountCents: number;
  description: string;
  state: TransactionState;
  categoryName: string | null;
  payeeName: string | null;
  // True when the transaction is paired with another one (e.g. two sides of a transfer).
  isPaired: boolean;
};
