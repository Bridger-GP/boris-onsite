"use client";

import { useState } from "react";
import { usePagination } from "@/client/transactions/hooks/usePagination";
import { useRowSelection } from "@/client/transactions/hooks/useRowSelection";
import { useTransactionDialog } from "@/client/transactions/hooks/useTransactionDialog";
import type { TransactionRow } from "@/client/transactions/types";
import { TransactionState } from "@/server/modules/transactions/transactionState";
import { BulkActionBar } from "@/components/BulkActionBar/BulkActionBar";
import { PaginationControls } from "@/components/PaginationControls/PaginationControls";
import { TransactionDialogs } from "@/components/TransactionDialogs/TransactionDialogs";
import { TransactionTable } from "@/components/TransactionTable/TransactionTable";

const PAGE_SIZE = 25;

type TransactionListViewProps = {
  // Mock data for now; will be replaced by a GraphQL query.
  initialTransactions: TransactionRow[];
  // Enables row checkboxes and the bulk-approve toolbar.
  enableBulkSelection?: boolean;
};

// Container for a paged transaction review list: owns the rows, paging, selection and dialog state.
export function TransactionListView({
  initialTransactions,
  enableBulkSelection = false,
}: TransactionListViewProps) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const pagination = usePagination(transactions, PAGE_SIZE);
  const selection = useRowSelection();
  const { dialog, openEdit, openPair, close } = useTransactionDialog();

  // Marks the selected rows as REVIEWED locally. Stand-in for a future bulk-approve mutation.
  function approveSelected() {
    setTransactions((previous) =>
      previous.map((transaction) => {
        if (!selection.selectedIds.has(transaction.id)) {
          return transaction;
        }
        return { ...transaction, state: TransactionState.REVIEWED };
      }),
    );
    selection.clear();
  }

  const tableSelection = enableBulkSelection
    ? {
        isSelected: selection.isSelected,
        toggleRow: selection.toggle,
        togglePage: selection.toggleMany,
      }
    : undefined;

  return (
    <div className="relative flex flex-col gap-4">
      {enableBulkSelection && (
        // Positioned out of flow so it sits on the tab row (rendered by the layout) instead of pushing the table down.
        // The 1.5rem offset matches the `gap-6` between the tabs and this view in app/transactions/layout.tsx.
        <div className="absolute bottom-[calc(100%+1.5rem)] right-0">
          <BulkActionBar
            selectedCount={selection.selectedIds.size}
            onApprove={approveSelected}
            onClear={selection.clear}
          />
        </div>
      )}
      <TransactionTable
        transactions={pagination.pageItems}
        selection={tableSelection}
        onEdit={openEdit}
        onPair={openPair}
      />
      <PaginationControls
        page={pagination.page}
        pageCount={pagination.pageCount}
        totalCount={pagination.totalCount}
        onPageChange={pagination.setPage}
      />
      <TransactionDialogs dialog={dialog} onClose={close} />
    </div>
  );
}
