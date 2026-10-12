import { prisma } from "@/lib/db";
import { GraphQLError } from "graphql";
import { toGraphQLTransaction } from "./api";
import {
  DbTransaction,
  TransactionForWrite,
  WriteErrorCode,
  assertCategoryBelongsToClient,
  assertEditableState,
  assertNotPaired,
  assertNotSplit,
  assertPayeeBelongsToClient,
  assertReadyToSubmit,
  loadTransactionForWrite,
  writeError,
} from "./transactionRules";
import { TransactionState } from "./transactionState";

// Each mutation runs inside a single DB transaction, so its checks and writes are
// atomic: if any rule fails, nothing is written.

// Reloads a transaction with its splits and converts it to the GraphQL shape.
async function loadForResponse(db: DbTransaction, transactionId: string) {
  const transaction = await db.transaction.findUniqueOrThrow({
    where: { id: transactionId },
    include: { splits: { orderBy: { id: "asc" } } },
  });
  return toGraphQLTransaction(transaction);
}

// --- Bulk approve -------------------------------------------------------------

type BulkApproveArgs = {
  transactionIds: string[];
};

type BulkApproveFailure = {
  transactionId: string;
  message: string;
};

// Loads the other side of a paired transaction (if any) and checks it can be
// reviewed alongside it. Returns null for unpaired transactions.
async function loadPairPartnerForReview(
  db: DbTransaction,
  transaction: TransactionForWrite,
): Promise<TransactionForWrite | null> {
  if (transaction.pairTransactionId === null) {
    return null;
  }
  const partner = await loadTransactionForWrite(db, transaction.pairTransactionId);
  assertEditableState(partner);
  return partner;
}

// Marks every given transaction REVIEWED, along with the other side of any pairs.
// All-or-nothing: each one must pass the same rules as `submitTransaction`, and if
// any fail, none are approved and the error lists every failure in
// `extensions.failures`. Returns every approved transaction, including pair partners.
export const bulkApproveTransactions = async (
  _parent: unknown,
  args: BulkApproveArgs,
) => {
  const requestedIds = Array.from(new Set(args.transactionIds));

  return prisma.$transaction(async (db) => {
    const transactionIds = [...requestedIds];

    // Check every transaction first so the caller sees all problems at once.
    const failures: BulkApproveFailure[] = [];
    for (const transactionId of requestedIds) {
      try {
        const transaction = await loadTransactionForWrite(db, transactionId);
        assertEditableState(transaction);
        assertReadyToSubmit(transaction);

        // Approving one side of a pair approves the other side too.
        const partner = await loadPairPartnerForReview(db, transaction);
        if (partner !== null && !transactionIds.includes(partner.id)) {
          transactionIds.push(partner.id);
        }
      } catch (error) {
        if (!(error instanceof GraphQLError)) {
          throw error;
        }
        failures.push({ transactionId, message: error.message });
      }
    }

    if (failures.length > 0) {
      throw new GraphQLError(
        `${failures.length} of ${requestedIds.length} transactions cannot be approved`,
        { extensions: { code: WriteErrorCode.INVALID_INPUT, failures } },
      );
    }

    await db.transaction.updateMany({
      where: { id: { in: transactionIds } },
      data: { state: TransactionState.REVIEWED },
    });

    const approved = [];
    for (const transactionId of transactionIds) {
      approved.push(await loadForResponse(db, transactionId));
    }
    return approved;
  });
};

// --- Submit -------------------------------------------------------------------

type SubmitArgs = {
  transactionId: string;
  // Omitted or null means "leave as is".
  categoryId?: string | null;
  payeeId?: string | null;
};

// Applies an optional category and payee to a transaction, then marks it REVIEWED.
// The transaction must end up with a category, a pair, or a split. If it's paired,
// the other side is marked REVIEWED too (its category and payee are left as is).
export const submitTransaction = async (_parent: unknown, args: SubmitArgs) => {
  return prisma.$transaction(async (db) => {
    const transaction = await loadTransactionForWrite(db, args.transactionId);
    assertEditableState(transaction);
    const partner = await loadPairPartnerForReview(db, transaction);

    const clientId = transaction.account.clientId;
    let categoryId = transaction.categoryId;
    let payeeId = transaction.payeeId;

    if (args.categoryId) {
      await assertCategoryBelongsToClient(db, args.categoryId, clientId);
      categoryId = args.categoryId;
    }
    if (args.payeeId) {
      await assertPayeeBelongsToClient(db, args.payeeId, clientId);
      payeeId = args.payeeId;
    }

    // Check the submission rule against the transaction as it will be saved.
    assertReadyToSubmit({ ...transaction, categoryId, payeeId });

    await db.transaction.update({
      where: { id: transaction.id },
      data: { categoryId, payeeId, state: TransactionState.REVIEWED },
    });

    if (partner !== null) {
      await db.transaction.update({
        where: { id: partner.id },
        data: { state: TransactionState.REVIEWED },
      });
    }

    return loadForResponse(db, transaction.id);
  });
};

// --- Pair / unpair ------------------------------------------------------------

type PairArgs = {
  firstTransactionId: string;
  secondTransactionId: string;
};

// Loads both sides of a pair request, checking they're distinct and both editable.
async function loadPairSides(
  db: DbTransaction,
  args: PairArgs,
): Promise<[TransactionForWrite, TransactionForWrite]> {
  if (args.firstTransactionId === args.secondTransactionId) {
    throw writeError(
      WriteErrorCode.INVALID_INPUT,
      "A transaction cannot be paired with itself",
    );
  }

  const first = await loadTransactionForWrite(db, args.firstTransactionId);
  const second = await loadTransactionForWrite(db, args.secondTransactionId);
  assertEditableState(first);
  assertEditableState(second);
  return [first, second];
}

// True when the two transactions already point at each other.
function arePairedToEachOther(
  first: TransactionForWrite,
  second: TransactionForWrite,
): boolean {
  return (
    first.pairTransactionId === second.id &&
    second.pairTransactionId === first.id
  );
}

// Throws if the transaction is already paired with something other than `otherId`.
function assertNotPairedElsewhere(
  transaction: TransactionForWrite,
  otherId: string,
): void {
  const pairedId = transaction.pairTransactionId;
  if (pairedId !== null && pairedId !== otherId) {
    throw writeError(
      WriteErrorCode.INVALID_STATE,
      `Transaction ${transaction.id} is already paired with ${pairedId}; unpair it first`,
    );
  }
}

// Links two transactions as the two sides of a transfer. Does not change state.
// Pairing two transactions that are already paired to each other is a no-op.
export const pairTransactions = async (_parent: unknown, args: PairArgs) => {
  return prisma.$transaction(async (db) => {
    const [first, second] = await loadPairSides(db, args);

    if (!arePairedToEachOther(first, second)) {
      assertNotPairedElsewhere(first, second.id);
      assertNotPairedElsewhere(second, first.id);
      assertNotSplit(first);
      assertNotSplit(second);

      if (first.account.clientId !== second.account.clientId) {
        throw writeError(
          WriteErrorCode.INVALID_INPUT,
          "Transactions belong to different clients and cannot be paired",
        );
      }

      await db.transaction.update({
        where: { id: first.id },
        data: { pairTransactionId: second.id },
      });
      await db.transaction.update({
        where: { id: second.id },
        data: { pairTransactionId: first.id },
      });
    }

    return [
      await loadForResponse(db, first.id),
      await loadForResponse(db, second.id),
    ];
  });
};

// Removes the link between two paired transactions. Does not change state.
export const unpairTransactions = async (_parent: unknown, args: PairArgs) => {
  return prisma.$transaction(async (db) => {
    const [first, second] = await loadPairSides(db, args);

    if (!arePairedToEachOther(first, second)) {
      throw writeError(
        WriteErrorCode.INVALID_INPUT,
        `Transactions ${first.id} and ${second.id} are not paired with each other`,
      );
    }

    await db.transaction.update({
      where: { id: first.id },
      data: { pairTransactionId: null },
    });
    await db.transaction.update({
      where: { id: second.id },
      data: { pairTransactionId: null },
    });

    return [
      await loadForResponse(db, first.id),
      await loadForResponse(db, second.id),
    ];
  });
};

// --- Split / unsplit ----------------------------------------------------------

type SplitInput = {
  categoryId: string;
  payeeId?: string | null;
  amountCents: number;
};

type SplitArgs = {
  transactionId: string;
  splits: SplitInput[];
};

// Throws unless there are at least two split lines and they sum to the transaction amount.
function assertSplitAmountsAddUp(
  transaction: TransactionForWrite,
  splits: SplitInput[],
): void {
  if (splits.length < 2) {
    throw writeError(
      WriteErrorCode.INVALID_INPUT,
      "A split needs at least two lines",
    );
  }

  let totalCents = 0;
  for (const split of splits) {
    totalCents += split.amountCents;
  }

  if (totalCents !== transaction.amountCents) {
    throw writeError(
      WriteErrorCode.INVALID_INPUT,
      `Split amounts total ${totalCents} cents but the transaction is ${transaction.amountCents} cents`,
    );
  }
}

// Splits a transaction across categories/payees, replacing any existing splits.
// The parent's own category is cleared, since the splits now carry the categories.
// Does not change state.
export const splitTransaction = async (_parent: unknown, args: SplitArgs) => {
  return prisma.$transaction(async (db) => {
    const transaction = await loadTransactionForWrite(db, args.transactionId);
    assertEditableState(transaction);
    assertNotPaired(transaction);
    assertSplitAmountsAddUp(transaction, args.splits);

    const clientId = transaction.account.clientId;
    for (const split of args.splits) {
      await assertCategoryBelongsToClient(db, split.categoryId, clientId);
      if (split.payeeId) {
        await assertPayeeBelongsToClient(db, split.payeeId, clientId);
      }
    }

    await db.splitTransaction.deleteMany({
      where: { transactionId: transaction.id },
    });
    await db.transaction.update({
      where: { id: transaction.id },
      data: {
        categoryId: null,
        splits: {
          create: args.splits.map((split) => ({
            categoryId: split.categoryId,
            payeeId: split.payeeId ?? null,
            amountCents: split.amountCents,
          })),
        },
      },
    });

    return loadForResponse(db, transaction.id);
  });
};

type UnsplitArgs = {
  transactionId: string;
};

// Removes all splits from a transaction. Does not change state.
export const unsplitTransaction = async (_parent: unknown, args: UnsplitArgs) => {
  return prisma.$transaction(async (db) => {
    const transaction = await loadTransactionForWrite(db, args.transactionId);
    assertEditableState(transaction);

    if (transaction.splits.length === 0) {
      throw writeError(
        WriteErrorCode.INVALID_INPUT,
        `Transaction ${transaction.id} is not split`,
      );
    }

    await db.splitTransaction.deleteMany({
      where: { transactionId: transaction.id },
    });

    return loadForResponse(db, transaction.id);
  });
};
