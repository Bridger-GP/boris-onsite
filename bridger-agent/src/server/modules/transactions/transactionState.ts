// Lifecycle states for a Transaction. Stored in the DB as a plain string (Transaction.state);
// this is the source of truth for the allowed values.
export const TransactionState = {
  INGESTED: "INGESTED",
  READY_FOR_REVIEW: "READY_FOR_REVIEW",
  PROBLEM: "PROBLEM",
  REVIEWED: "REVIEWED",
  WRITTEN: "WRITTEN",
  IGNORED: "IGNORED",
} as const;

export type TransactionState =
  (typeof TransactionState)[keyof typeof TransactionState];

// Narrows a raw DB string to a TransactionState, throwing if it isn't one.
export function parseTransactionState(value: string): TransactionState {
  const allowedStates: string[] = Object.values(TransactionState);
  if (!allowedStates.includes(value)) {
    throw new Error(`Unknown transaction state: ${value}`);
  }
  return value as TransactionState;
}
