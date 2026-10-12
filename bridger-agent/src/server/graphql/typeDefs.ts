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

    "One transaction by ID, or null if it doesn't exist."
    transaction(id: ID!): Transaction
  }

  """
  Write operations on transactions. All of them require the transaction(s) to be
  READY_FOR_REVIEW or PROBLEM, and are atomic: on error, nothing is changed.
  """
  type Mutation {
    """
    Marks every given transaction REVIEWED, plus the other side of any pairs.
    All-or-nothing: if any transaction fails the submit rules, none are approved
    and extensions.failures lists why. Returns all approved transactions,
    including pair partners.
    """
    bulkApproveTransactions(transactionIds: [ID!]!): [Transaction!]!

    """
    Sets the category and/or payee (when given), then marks the transaction
    REVIEWED. The transaction must end up with a category, a pair, or a split.
    If it's paired, the other side is marked REVIEWED too.
    """
    submitTransaction(transactionId: ID!, categoryId: ID, payeeId: ID): Transaction!

    "Links two transactions as the two sides of a transfer. Does not change state."
    pairTransactions(firstTransactionId: ID!, secondTransactionId: ID!): [Transaction!]!

    "Removes the link between two paired transactions. Does not change state."
    unpairTransactions(firstTransactionId: ID!, secondTransactionId: ID!): [Transaction!]!

    """
    Splits a transaction, replacing any existing splits. Amounts must sum to the
    transaction amount. Clears the parent's category. Does not change state.
    """
    splitTransaction(transactionId: ID!, splits: [SplitInput!]!): Transaction!

    "Removes all splits from a transaction. Does not change state."
    unsplitTransaction(transactionId: ID!): Transaction!

    """
    Creates an unreviewed payee for a client. The name is trimmed and must be
    unique (case-sensitive) within the client.
    """
    createPayee(clientId: ID!, name: String!): Payee!

    "Marks a payee as reviewed. No-op if it already is."
    reviewPayee(payeeId: ID!): Payee!
  }

  input SplitInput {
    categoryId: ID!
    payeeId: ID
    "Signed cents, same sign convention as Transaction.amountCents."
    amountCents: Int!
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
    "Whether a human has confirmed this payee."
    reviewed: Boolean!
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
