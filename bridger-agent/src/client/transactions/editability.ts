import {
  TransactionState,
  type TransactionState as TransactionStateValue,
} from "@/server/modules/transactions/transactionState";

// States in which the server still accepts edits/submits (mirrors EDITABLE_STATES in transactionRules.ts).
const EDITABLE_STATES: TransactionStateValue[] = [
  TransactionState.READY_FOR_REVIEW,
  TransactionState.PROBLEM,
];

// True if a transaction in this state can still be edited and submitted.
export function isEditableState(state: TransactionStateValue): boolean {
  return EDITABLE_STATES.includes(state);
}

// Why a transaction can't be paired, or null if it can.
// Mirrors the server's pairTransactions rules: editable state, not split, not already paired.
export function getPairBlocker(transaction: {
  state: TransactionStateValue;
  isSplit: boolean;
  isPaired: boolean;
}): string | null {
  if (!isEditableState(transaction.state)) {
    return "Already processed";
  }
  if (transaction.isSplit) {
    return "Split";
  }
  if (transaction.isPaired) {
    return "Already paired";
  }
  return null;
}
