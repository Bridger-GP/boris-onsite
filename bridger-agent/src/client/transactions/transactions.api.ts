import { gql } from "@apollo/client";

// Transaction fields the review UI reads. Shared by the list query and mutations,
// so mutation responses refresh the same cached fields the table renders.
const TRANSACTION_FIELDS = gql`
  fragment TransactionFields on Transaction {
    id
    accountId
    externalId
    amountCents
    date
    description
    state
    categoryId
    payeeId
    pairTransactionId
    splits {
      id
      categoryId
      payeeId
      amountCents
    }
  }
`;

// Payee fields, including whether a human has confirmed the payee.
const PAYEE_FIELDS = gql`
  fragment PayeeFields on Payee {
    id
    name
    reviewed
  }
`;

// Accounts, categories and payees for a client, fetched together.
// Categories and payees are used to resolve the IDs on transactions into display names.
export const CLIENT_REFERENCE_DATA = gql`
  query ClientReferenceData($clientId: ID!) {
    accounts(clientId: $clientId) {
      id
      name
    }
    categories(clientId: $clientId) {
      id
      name
    }
    payees(clientId: $clientId) {
      ...PayeeFields
    }
  }
  ${PAYEE_FIELDS}
`;

// One batch of an account's transactions, newest first. Pass the previous batch's endCursor as `after`.
export const TRANSACTIONS_PAGE = gql`
  query TransactionsPage($accountId: ID!, $confidence: Confidence, $first: Int, $after: String) {
    transactions(accountId: $accountId, confidence: $confidence, first: $first, after: $after) {
      nodes {
        ...TransactionFields
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${TRANSACTION_FIELDS}
`;

// Sets the category and/or payee (null = leave unchanged) and marks the transaction REVIEWED.
export const SUBMIT_TRANSACTION = gql`
  mutation SubmitTransaction($transactionId: ID!, $categoryId: ID, $payeeId: ID) {
    submitTransaction(transactionId: $transactionId, categoryId: $categoryId, payeeId: $payeeId) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`;

// Marks a payee as reviewed (confirmed by a human).
export const REVIEW_PAYEE = gql`
  mutation ReviewPayee($payeeId: ID!) {
    reviewPayee(payeeId: $payeeId) {
      ...PayeeFields
    }
  }
  ${PAYEE_FIELDS}
`;

// Marks the given transactions (and their pair partners) REVIEWED. All-or-nothing: if any fail the
// submit rules, none are approved and the error's extensions.failures lists why.
export const BULK_APPROVE_TRANSACTIONS = gql`
  mutation BulkApproveTransactions($transactionIds: [ID!]!) {
    bulkApproveTransactions(transactionIds: $transactionIds) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`;

// Creates an (unreviewed) payee for a client. Names must be unique within the client.
export const CREATE_PAYEE = gql`
  mutation CreatePayee($clientId: ID!, $name: String!) {
    createPayee(clientId: $clientId, name: $name) {
      ...PayeeFields
    }
  }
  ${PAYEE_FIELDS}
`;

// Replaces a transaction's split lines. Lines must sum to the transaction amount; clears the parent's category.
export const SPLIT_TRANSACTION = gql`
  mutation SplitTransaction($transactionId: ID!, $splits: [SplitInput!]!) {
    splitTransaction(transactionId: $transactionId, splits: $splits) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`;

// Removes all split lines from a transaction.
export const UNSPLIT_TRANSACTION = gql`
  mutation UnsplitTransaction($transactionId: ID!) {
    unsplitTransaction(transactionId: $transactionId) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`;

// One transaction by ID (null if it doesn't exist). Used to show the other side of a pair.
export const TRANSACTION_BY_ID = gql`
  query TransactionById($id: ID!) {
    transaction(id: $id) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`;

// Links two transactions as the two sides of a transfer. Returns both sides; doesn't change state.
export const PAIR_TRANSACTIONS = gql`
  mutation PairTransactions($firstTransactionId: ID!, $secondTransactionId: ID!) {
    pairTransactions(firstTransactionId: $firstTransactionId, secondTransactionId: $secondTransactionId) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`;

// Removes the link between two paired transactions. Returns both sides; doesn't change state.
export const UNPAIR_TRANSACTIONS = gql`
  mutation UnpairTransactions($firstTransactionId: ID!, $secondTransactionId: ID!) {
    unpairTransactions(firstTransactionId: $firstTransactionId, secondTransactionId: $secondTransactionId) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`;
