import { prisma } from "@/lib/db";
import { Prisma, SplitTransaction, Transaction } from "@prisma/client";
import { GraphQLError } from "graphql";
import { parseTransactionState } from "./transactionState";

const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;

// Matches the GraphQL `Confidence` enum; maps onto Transaction.isHighConfidence.
type Confidence = "HIGH" | "LOW";

type TransactionsArgs = {
  accountId: string;
  confidence?: Confidence | null;
  // Page size.
  first?: number | null;
  // Cursor (a transaction ID) to start after, taken from a previous page's endCursor.
  after?: string | null;
};

export type TransactionWithSplits = Transaction & { splits: SplitTransaction[] };

// Validates the requested page size, falling back to the default and capping at the max.
function resolvePageSize(first: number | null | undefined): number {
  if (first === null || first === undefined) {
    return DEFAULT_PAGE_SIZE;
  }
  if (first < 1) {
    throw new GraphQLError("`first` must be at least 1");
  }
  return Math.min(first, MAX_PAGE_SIZE);
}

// Builds the Prisma filter for an account's transactions, optionally narrowed by confidence.
function buildTransactionsFilter(
  args: TransactionsArgs,
): Prisma.TransactionWhereInput {
  const filter: Prisma.TransactionWhereInput = { accountId: args.accountId };
  if (args.confidence === "HIGH") {
    filter.isHighConfidence = true;
  }
  if (args.confidence === "LOW") {
    filter.isHighConfidence = false;
  }
  return filter;
}

// Formats a stored transaction date (midnight UTC) as a "YYYY-MM-DD" calendar date.
function formatCalendarDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Converts a DB row into the shape of the GraphQL `Transaction` type.
export function toGraphQLTransaction(transaction: TransactionWithSplits) {
  let confidence: Confidence = "LOW";
  if (transaction.isHighConfidence) {
    confidence = "HIGH";
  }

  return {
    id: transaction.id,
    accountId: transaction.accountId,
    externalId: transaction.externalId,
    amountCents: transaction.amountCents,
    date: formatCalendarDate(transaction.date),
    description: transaction.description,
    state: parseTransactionState(transaction.state),
    categoryId: transaction.categoryId,
    payeeId: transaction.payeeId,
    confidence,
    pairTransactionId: transaction.pairTransactionId,
    needsClientFeedback: transaction.needsClientFeedback,
    splits: transaction.splits.map((split) => ({
      id: split.id,
      categoryId: split.categoryId,
      payeeId: split.payeeId,
      amountCents: split.amountCents,
    })),
  };
}

// Returns one page of an account's transactions (newest first) with their splits,
// using cursor pagination: pass the previous page's `endCursor` as `after`.
export const transactions = async (
  _parent: unknown,
  args: TransactionsArgs,
) => {
  const pageSize = resolvePageSize(args.first);
  const filter = buildTransactionsFilter(args);

  const query = {
    where: filter,
    include: { splits: { orderBy: { id: "asc" } } },
    // Sorting by id as well keeps the order stable for transactions on the same date.
    orderBy: [{ date: "desc" }, { id: "desc" }],
    // Fetch one extra row so we know whether another page exists.
    take: pageSize + 1,
  } satisfies Prisma.TransactionFindManyArgs;

  // Start from the cursor row and skip it, so the page begins right after it.
  let rows: TransactionWithSplits[];
  if (args.after) {
    rows = await prisma.transaction.findMany({
      ...query,
      cursor: { id: args.after },
      skip: 1,
    });
  } else {
    rows = await prisma.transaction.findMany(query);
  }

  const hasNextPage = rows.length > pageSize;
  const pageRows = rows.slice(0, pageSize);

  let endCursor: string | null = null;
  if (pageRows.length > 0) {
    endCursor = pageRows[pageRows.length - 1].id;
  }

  const totalCount = await prisma.transaction.count({ where: filter });

  return {
    nodes: pageRows.map(toGraphQLTransaction),
    pageInfo: { hasNextPage, endCursor },
    totalCount,
  };
};
