// GraphQL schema definition (SDL) for the /api/graphql endpoint.
export const typeDefs = /* GraphQL */ `
  type Query {
    greetings: String

    "All bank accounts for a client."
    accounts(clientId: ID!): [Account!]!

    "All categories for a client."
    categories(clientId: ID!): [Category!]!

    "All payees for a client."
    payees(clientId: ID!): [Payee!]!

    """
    One page of an account's transactions, newest first. Pass the previous
    page's pageInfo.endCursor as \`after\` to fetch the next page.
    """
    transactions(
      accountId: ID!
      confidence: Confidence
      "Page size. Defaults to 50, max 100."
      first: Int
      after: String
    ): TransactionPage!
  }

  type Account {
    id: ID!
    name: String!
  }

  type Category {
    id: ID!
    name: String!
  }

  type Payee {
    id: ID!
    name: String!
  }

  enum Confidence {
    HIGH
    LOW
  }

  enum TransactionState {
    INGESTED
    READY_FOR_REVIEW
    PROBLEM
    REVIEWED
    WRITTEN
    IGNORED
  }

  type Transaction {
    id: ID!
    accountId: ID!
    "ID from the external bank feed."
    externalId: String!
    "Signed amount in cents; negative means money left the account."
    amountCents: Int!
    "Calendar date, formatted YYYY-MM-DD."
    date: String!
    description: String!
    state: TransactionState!
    categoryId: ID
    payeeId: ID
    confidence: Confidence!
    "The other side of a transfer between two of the client's accounts."
    pairTransactionId: ID
    needsClientFeedback: Boolean!
    splits: [SplitTransaction!]!
  }

  type SplitTransaction {
    id: ID!
    categoryId: ID
    payeeId: ID
    amountCents: Int!
  }

  type PageInfo {
    hasNextPage: Boolean!
    "Pass as \`after\` to fetch the next page. Null when the page is empty."
    endCursor: String
  }

  type TransactionPage {
    nodes: [Transaction!]!
    pageInfo: PageInfo!
    "Total transactions matching the filters, across all pages."
    totalCount: Int!
  }
`;
