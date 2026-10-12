import { WriteErrorCode, writeError } from "@/server/graphql/errors";
import { Prisma } from "@prisma/client";
import { TransactionState } from "./transactionState";

// A Prisma client scoped to an interactive transaction (what `prisma.$transaction` passes in).
export type DbTransaction = Prisma.TransactionClient;

// A transaction row loaded with everything the write rules need to check.
export type TransactionForWrite = Prisma.TransactionGetPayload<{
  include: { account: true; splits: true };
}>;

// States in which a transaction can still be edited, paired, split or submitted.
const EDITABLE_STATES: string[] = [
  TransactionState.READY_FOR_REVIEW,
  TransactionState.PROBLEM,
];

// Loads a transaction with its account and splits, throwing NOT_FOUND if it doesn't exist.
export async function loadTransactionForWrite(
  db: DbTransaction,
  transactionId: string,
): Promise<TransactionForWrite> {
  const transaction = await db.transaction.findUnique({
    where: { id: transactionId },
    include: { account: true, splits: true },
  });
  if (transaction === null) {
    throw writeError(WriteErrorCode.NOT_FOUND, `Transaction ${transactionId} not found`);
  }
  return transaction;
}

// Throws unless the transaction is READY_FOR_REVIEW or PROBLEM.
export function assertEditableState(transaction: TransactionForWrite): void {
  if (!EDITABLE_STATES.includes(transaction.state)) {
    throw writeError(
      WriteErrorCode.INVALID_STATE,
      `Transaction ${transaction.id} is ${transaction.state}; it must be READY_FOR_REVIEW or PROBLEM`,
    );
  }
}

// Throws if the transaction is paired, since pairs and splits are mutually exclusive.
export function assertNotPaired(transaction: TransactionForWrite): void {
  if (transaction.pairTransactionId !== null) {
    throw writeError(
      WriteErrorCode.INVALID_STATE,
      `Transaction ${transaction.id} is paired; unpair it before splitting`,
    );
  }
}

// Throws if the transaction is split, since pairs and splits are mutually exclusive.
export function assertNotSplit(transaction: TransactionForWrite): void {
  if (transaction.splits.length > 0) {
    throw writeError(
      WriteErrorCode.INVALID_STATE,
      `Transaction ${transaction.id} is split; unsplit it before pairing`,
    );
  }
}

// Throws unless the transaction has been categorized in at least one way:
// a category, a pair, or a split.
export function assertReadyToSubmit(transaction: TransactionForWrite): void {
  const hasCategory = transaction.categoryId !== null;
  const isPaired = transaction.pairTransactionId !== null;
  const isSplit = transaction.splits.length > 0;

  if (!hasCategory && !isPaired && !isSplit) {
    throw writeError(
      WriteErrorCode.INVALID_INPUT,
      `Transaction ${transaction.id} needs a category, a pair, or a split before it can be reviewed`,
    );
  }
}

// Throws unless the category exists and belongs to the given client.
export async function assertCategoryBelongsToClient(
  db: DbTransaction,
  categoryId: string,
  clientId: string,
): Promise<void> {
  const category = await db.category.findUnique({ where: { id: categoryId } });
  if (category === null || category.clientId !== clientId) {
    throw writeError(
      WriteErrorCode.INVALID_INPUT,
      `Category ${categoryId} not found for this client`,
    );
  }
}

// Throws unless the payee exists and belongs to the given client.
export async function assertPayeeBelongsToClient(
  db: DbTransaction,
  payeeId: string,
  clientId: string,
): Promise<void> {
  const payee = await db.payee.findUnique({ where: { id: payeeId } });
  if (payee === null || payee.clientId !== clientId) {
    throw writeError(
      WriteErrorCode.INVALID_INPUT,
      `Payee ${payeeId} not found for this client`,
    );
  }
}
