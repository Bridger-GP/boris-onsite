import { type ApolloError, useMutation } from "@apollo/client";
import type {
  BulkApproveFailure,
  BulkApproveTransactionsResult,
  BulkApproveTransactionsVariables,
} from "../apiTypes";
import { BULK_APPROVE_TRANSACTIONS } from "../transactions.api";

// Approves several transactions at once. The response includes every approved transaction
// (and pair partners), so Apollo updates their cached state automatically.
export function useBulkApproveTransactions() {
  const [mutate, { loading, error, reset }] = useMutation<
    BulkApproveTransactionsResult,
    BulkApproveTransactionsVariables
  >(BULK_APPROVE_TRANSACTIONS);

  // Returns true on success, false on failure (details are exposed via `error` / `failures`).
  async function approve(transactionIds: string[]): Promise<boolean> {
    try {
      await mutate({ variables: { transactionIds } });
      return true;
    } catch {
      return false;
    }
  }

  return {
    approve,
    approving: loading,
    error,
    failures: extractFailures(error),
    // Clears the error, e.g. when the user dismisses it.
    dismissError: reset,
  };
}

// Pulls the per-transaction failures out of the server's all-or-nothing error, if present.
function extractFailures(error: ApolloError | undefined): BulkApproveFailure[] {
  if (!error) {
    return [];
  }
  const failures: BulkApproveFailure[] = [];
  for (const graphQLError of error.graphQLErrors) {
    const reported = graphQLError.extensions?.failures;
    if (Array.isArray(reported)) {
      failures.push(...(reported as BulkApproveFailure[]));
    }
  }
  return failures;
}
