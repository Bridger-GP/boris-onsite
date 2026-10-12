import { NetworkStatus, useQuery } from "@apollo/client";
import type {
  Confidence,
  TransactionsPageResult,
  TransactionsPageVariables,
} from "../apiTypes";
import { TRANSACTIONS_PAGE } from "../transactions.api";

type UseTransactionListOptions = {
  accountId: string;
  // Omit to list every transaction in the account regardless of confidence.
  confidence?: Confidence;
  // How many transactions to fetch per request ("load more" batch size).
  batchSize: number;
};

// Fetches an account's transactions in batches, using the "load more" pattern.
// Batches are appended by the `transactions` merge policy in apollo-client.ts.
export function useTransactionList({
  accountId,
  confidence,
  batchSize,
}: UseTransactionListOptions) {
  const { data, error, networkStatus, fetchMore } = useQuery<
    TransactionsPageResult,
    TransactionsPageVariables
  >(TRANSACTIONS_PAGE, {
    variables: { accountId, confidence, first: batchSize },
    // Needed so networkStatus reports fetchMore, letting us show a "loading more" state.
    notifyOnNetworkStatusChange: true,
  });

  const page = data?.transactions;
  const hasMore = page?.pageInfo.hasNextPage ?? false;

  // Fetches the next batch after the last loaded transaction.
  function loadMore() {
    if (!page || !hasMore) {
      return;
    }
    fetchMore({ variables: { after: page.pageInfo.endCursor } });
  }

  return {
    transactions: page?.nodes ?? [],
    totalCount: page?.totalCount ?? 0,
    hasMore,
    loadMore,
    loading: networkStatus === NetworkStatus.loading,
    loadingMore: networkStatus === NetworkStatus.fetchMore,
    error,
  };
}
