"use client";

import { useMemo, useState } from "react";
import type { Confidence } from "@/client/transactions/apiTypes";
import { useRowSelection } from "@/client/transactions/hooks/useRowSelection";
import { useTransactionDialog } from "@/client/transactions/hooks/useTransactionDialog";
import { useTransactionList } from "@/client/transactions/hooks/useTransactionList";
import { toTransactionRow } from "@/client/transactions/toTransactionRow";
import { TransactionState } from "@/server/modules/transactions/transactionState";
import { BulkActionBar } from "@/components/BulkActionBar/BulkActionBar";
import { LoadMoreFooter } from "@/components/LoadMoreFooter/LoadMoreFooter";
import { StatusMessage } from "@/components/StatusMessage/StatusMessage";
import { TransactionDialogs } from "@/components/TransactionDialogs/TransactionDialogs";
import { TransactionTable } from "@/components/TransactionTable/TransactionTable";

const BATCH_SIZE = 25;

type AccountTransactionListProps = {
  accountId: string;
  confidence: Confidence;
  categoryNamesById: Map<string, string>;
  payeeNamesById: Map<string, string>;
  // Enables row checkboxes and the bulk-approve toolbar.
  enableBulkSelection: boolean;
};

// Container for one account's transaction list: fetching, selection, bulk approve and per-row dialogs.
export function AccountTransactionList({
  accountId,
  confidence,
  categoryNamesById,
  payeeNamesById,
  enableBulkSelection,
}: AccountTransactionListProps) {
  const list = useTransactionList({ accountId, confidence, batchSize: BATCH_SIZE });
  const selection = useRowSelection();
  const { dialog, openEdit, openPair, close } = useTransactionDialog();

  // IDs approved in this session. Stand-in for a bulk-approve mutation, which doesn't exist yet.
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());

  // Map API rows to table rows, showing locally approved ones as REVIEWED.
  const rows = useMemo(() => {
    return list.transactions.map((transaction) => {
      const row = toTransactionRow(transaction, categoryNamesById, payeeNamesById);
      if (approvedIds.has(row.id)) {
        return { ...row, state: TransactionState.REVIEWED };
      }
      return row;
    });
  }, [list.transactions, categoryNamesById, payeeNamesById, approvedIds]);

  function approveSelected() {
    setApprovedIds((previous) => new Set([...previous, ...selection.selectedIds]));
    selection.clear();
  }

  if (list.loading) {
    return <StatusMessage>Loading transactions…</StatusMessage>;
  }
  if (list.error) {
    return <StatusMessage tone="error">Couldn&apos;t load transactions: {list.error.message}</StatusMessage>;
  }
  if (rows.length === 0) {
    return <StatusMessage>No transactions for this account.</StatusMessage>;
  }

  const tableSelection = enableBulkSelection
    ? {
        isSelected: selection.isSelected,
        toggleRow: selection.toggle,
        toggleAll: selection.toggleMany,
      }
    : undefined;

  return (
    <div className="flex flex-col gap-4">
      {enableBulkSelection && (
        // Positioned out of flow so it sits on the tab row (rendered by the layout) instead of pushing the table down.
        // It is anchored to TransactionListView's `relative` root (this component's root is deliberately not positioned);
        // the 1.5rem offset matches the `gap-6` between the tabs and that root in app/transactions/layout.tsx.
        <div className="absolute bottom-[calc(100%+1.5rem)] right-0">
          <BulkActionBar
            selectedCount={selection.selectedIds.size}
            onApprove={approveSelected}
            onClear={selection.clear}
          />
        </div>
      )}
      <TransactionTable
        transactions={rows}
        selection={tableSelection}
        onEdit={openEdit}
        onPair={openPair}
      />
      <LoadMoreFooter
        loadedCount={rows.length}
        totalCount={list.totalCount}
        hasMore={list.hasMore}
        loadingMore={list.loadingMore}
        onLoadMore={list.loadMore}
      />
      <TransactionDialogs dialog={dialog} onClose={close} />
    </div>
  );
}
