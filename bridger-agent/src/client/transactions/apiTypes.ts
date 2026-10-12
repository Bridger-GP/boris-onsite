import type { TransactionState } from "@/server/modules/transactions/transactionState";

// Hand-written types for the queries in transactions.api.ts. Keep them in sync with the selected fields.

export type Confidence = "HIGH" | "LOW";

export type NamedEntity = {
  id: string;
  name: string;
};

export type ApiPayee = NamedEntity & {
  // Whether a human has confirmed this payee.
  reviewed: boolean;
};

export type ClientReferenceDataResult = {
  accounts: NamedEntity[];
  categories: NamedEntity[];
  payees: ApiPayee[];
};

export type ClientReferenceDataVariables = {
  clientId: string;
};

// One line of a split transaction.
export type ApiSplit = {
  id: string;
  categoryId: string | null;
  payeeId: string | null;
  // Signed cents, same sign convention as the parent transaction.
  amountCents: number;
};

export type ApiTransaction = {
  id: string;
  accountId: string;
  externalId: string;
  amountCents: number;
  // Calendar date, "YYYY-MM-DD".
  date: string;
  description: string;
  state: TransactionState;
  categoryId: string | null;
  payeeId: string | null;
  pairTransactionId: string | null;
  splits: ApiSplit[];
};

export type TransactionPage = {
  nodes: ApiTransaction[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
  totalCount: number;
};

export type TransactionsPageResult = {
  transactions: TransactionPage;
};

export type TransactionsPageVariables = {
  accountId: string;
  confidence?: Confidence;
  first?: number;
  after?: string | null;
};

export type SubmitTransactionResult = {
  submitTransaction: ApiTransaction;
};

export type SubmitTransactionVariables = {
  transactionId: string;
  // null leaves the current value unchanged; the API can't clear a category or payee.
  categoryId: string | null;
  payeeId: string | null;
};

export type ReviewPayeeResult = {
  reviewPayee: ApiPayee;
};

export type ReviewPayeeVariables = {
  payeeId: string;
};

export type BulkApproveTransactionsResult = {
  // Every approved transaction, including pair partners.
  bulkApproveTransactions: ApiTransaction[];
};

export type BulkApproveTransactionsVariables = {
  transactionIds: string[];
};

// One entry of the bulk-approve error's `extensions.failures`.
export type BulkApproveFailure = {
  transactionId: string;
  message: string;
};

export type CreatePayeeResult = {
  createPayee: ApiPayee;
};

export type CreatePayeeVariables = {
  clientId: string;
  name: string;
};

// Matches the GraphQL `SplitInput` type.
export type SplitInput = {
  categoryId: string;
  payeeId: string | null;
  amountCents: number;
};

export type SplitTransactionResult = {
  splitTransaction: ApiTransaction;
};

export type SplitTransactionVariables = {
  transactionId: string;
  splits: SplitInput[];
};

export type UnsplitTransactionResult = {
  unsplitTransaction: ApiTransaction;
};

export type UnsplitTransactionVariables = {
  transactionId: string;
};

export type TransactionByIdResult = {
  transaction: ApiTransaction | null;
};

export type TransactionByIdVariables = {
  id: string;
};

// Shared by pairTransactions and unpairTransactions.
export type PairTransactionsVariables = {
  firstTransactionId: string;
  secondTransactionId: string;
};

export type PairTransactionsResult = {
  pairTransactions: ApiTransaction[];
};

export type UnpairTransactionsResult = {
  unpairTransactions: ApiTransaction[];
};
