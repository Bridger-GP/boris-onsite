import { useMemo } from "react";
import { useTransactionList } from "@/client/transactions/hooks/useTransactionList";
import { toTransactionRow } from "@/client/transactions/toTransactionRow";
import type { ReferenceData } from "@/client/transactions/types";
import { LoadMoreFooter } from "@/components/LoadMoreFooter/LoadMoreFooter";
import { PairCandidateTable } from "@/components/PairCandidateTable/PairCandidateTable";
import { StatusMessage } from "@/components/StatusMessage/StatusMessage";

const BATCH_SIZE = 25;

type PairCandidateListProps = {
  accountId: string;
  referenceData: ReferenceData;
  selectedId: string | null;
  onSelect: (transactionId: string) => void;
};

// Loads an account's transactions (all confidences) for the pair picker, with "load more".
export function PairCandidateList({ accountId, referenceData, selectedId, onSelect }: PairCandidateListProps) {
  const list = useTransactionList({ accountId, batchSize: BATCH_SIZE });

  const candidates = useMemo(() => {
    return list.transactions.map((transaction) => toTransactionRow(transaction, referenceData));
  }, [list.transactions, referenceData]);

  if (list.loading) {
    return <StatusMessage>Loading transactions…</StatusMessage>;
  }
  if (list.error) {
    return <StatusMessage tone="error">Couldn&apos;t load transactions: {list.error.message}</StatusMessage>;
  }
  if (candidates.length === 0) {
    return <StatusMessage>No transactions in this account.</StatusMessage>;
  }

  return (
    <div className="flex flex-col gap-2">
      <PairCandidateTable candidates={candidates} selectedId={selectedId} onSelect={onSelect} />
      <LoadMoreFooter
        loadedCount={candidates.length}
        totalCount={list.totalCount}
        hasMore={list.hasMore}
        loadingMore={list.loadingMore}
        onLoadMore={list.loadMore}
      />
    </div>
  );
}
