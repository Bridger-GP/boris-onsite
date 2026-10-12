import type { TransactionState } from "@/server/modules/transactions/transactionState";

// Hand-written types for the queries in transactions.api.ts. Keep them in sync with the selected fields.

export type Confidence = "HIGH" | "LOW";

export type NamedEntity = {
  id: string;
  name: string;
};

export type ClientReferenceDataResult = {
  accounts: NamedEntity[];
  categories: NamedEntity[];
  payees: NamedEntity[];
};

export type ClientReferenceDataVariables = {
  clientId: string;
};

export type ApiTransaction = {
  id: string;
  externalId: string;
  amountCents: number;
  // Calendar date, "YYYY-MM-DD".
  date: string;
  description: string;
  state: TransactionState;
  categoryId: string | null;
  payeeId: string | null;
  pairTransactionId: string | null;
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
