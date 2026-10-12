"use client";

import { useMemo } from "react";
import type { Confidence } from "@/client/transactions/apiTypes";
import { useBulkApproveTransactions } from "@/client/transactions/hooks/useBulkApproveTransactions";
import { useRowSelection } from "@/client/transactions/hooks/useRowSelection";
import { useTransactionDialog } from "@/client/transactions/hooks/useTransactionDialog";
import { useTransactionList } from "@/client/transactions/hooks/useTransactionList";
import { toTransactionRow } from "@/client/transactions/toTransactionRow";
import type { ReferenceData } from "@/client/transactions/types";
import { BulkActionBar } from "@/components/BulkActionBar/BulkActionBar";
import { BulkApproveError } from "@/components/BulkApproveError/BulkApproveError";
import { LoadMoreFooter } from "@/components/LoadMoreFooter/LoadMoreFooter";
import { StatusMessage } from "@/components/StatusMessage/StatusMessage";
import { TransactionDialogs } from "@/components/TransactionDialogs/TransactionDialogs";
import { TransactionTable } from "@/components/TransactionTable/TransactionTable";

const BATCH_SIZE = 25;

type AccountTransactionListProps = {
  accountId: string;
  confidence: Confidence;
  referenceData: ReferenceData;
  // Enables row checkboxes and the bulk-approve toolbar.
  enableBulkSelection: boolean;
};

// Container for one account's transaction list: fetching, selection, bulk approve and per-row dialogs.
export function AccountTransactionList({
  accountId,
  confidence,
  referenceData,
  enableBulkSelection,
}: AccountTransactionListProps) {
  const list = useTransactionList({ accountId, confidence, batchSize: BATCH_SIZE });
  const selection = useRowSelection();
  const { dialog, openEdit, openPair, close } = useTransactionDialog();

  const bulkApprove = useBulkApproveTransactions();

  const rows = useMemo(() => {
    return list.transactions.map((transaction) => toTransactionRow(transaction, referenceData));
  }, [list.transactions, referenceData]);

  // Approves the selected rows. On failure nothing is approved, so keep the selection
  // to let the user deselect the problem rows and try again.
  async function approveSelected() {
    const succeeded = await bulkApprove.approve([...selection.selectedIds]);
    if (succeeded) {
      selection.clear();
    }
  }

  // Show the dialog the live row from the list (not the snapshot taken when it opened),
  // so changes saved from inside the dialog, like a new split, are reflected immediately.
  const liveDialog = dialog && {
    ...dialog,
    transaction: rows.find((row) => row.id === dialog.transaction.id) ?? dialog.transaction,
  };

  // Label each failure with the row's external ID, which is what the user sees in the table.
  const approveErrorItems = bulkApprove.failures.map((failure) => {
    const row = rows.find((candidate) => candidate.id === failure.transactionId);
    return { label: row?.externalId ?? failure.transactionId, message: failure.message };
  });

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
            approving={bulkApprove.approving}
            onApprove={approveSelected}
            onClear={selection.clear}
          />
        </div>
      )}
      {bulkApprove.error && (
        <BulkApproveError
          message={bulkApprove.error.message}
          items={approveErrorItems}
          onDismiss={bulkApprove.dismissError}
        />
      )}
      <TransactionTable
        transactions={rows}
        selection={tableSelection}
        onEdit={openEdit}
        onPair={openPair}
        referenceData={referenceData}
      />
      <LoadMoreFooter
        loadedCount={rows.length}
        totalCount={list.totalCount}
        hasMore={list.hasMore}
        loadingMore={list.loadingMore}
        onLoadMore={list.loadMore}
      />
      <TransactionDialogs dialog={liveDialog} referenceData={referenceData} onClose={close} />
    </div>
  );
}
