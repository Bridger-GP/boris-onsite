import { gql } from "@apollo/client";

// Accounts, categories and payees for a client, fetched together.
// Categories and payees are used to resolve the IDs on transactions into display names.
export const CLIENT_REFERENCE_DATA = gql(`
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
    id
    name
  }
}
`);

// One batch of an account's transactions, newest first. Pass the previous batch's endCursor as `after`.
export const TRANSACTIONS_PAGE = gql(`
query TransactionsPage($accountId: ID!, $confidence: Confidence, $first: Int, $after: String) {
  transactions(accountId: $accountId, confidence: $confidence, first: $first, after: $after) {
    nodes {
      id
      externalId
      amountCents
      date
      description
      state
      categoryId
      payeeId
      pairTransactionId
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}
`);
