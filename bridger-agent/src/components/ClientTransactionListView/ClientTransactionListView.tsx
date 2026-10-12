"use client";

import { useState } from "react";
import { useClientReferenceData } from "@/client/transactions/hooks/useClientReferenceData";
import { AccountSelect } from "@/components/AccountSelect/AccountSelect";
import { AccountTransactionList } from "@/components/AccountTransactionList/AccountTransactionList";
import { StatusMessage } from "@/components/StatusMessage/StatusMessage";
import type { TransactionListViewProps } from "@/components/TransactionListView/TransactionListView";

type ClientTransactionListViewProps = TransactionListViewProps & {
  clientId: string;
};

// Loads the client's reference data, lets the user pick an account, and shows that account's transactions.
export function ClientTransactionListView({
  clientId,
  confidence,
  enableBulkSelection = false,
}: ClientTransactionListViewProps) {
  const { accounts, categoryNamesById, payeeNamesById, loading, error } =
    useClientReferenceData(clientId);
  // null until the user picks an account; until then we show the first one.
  const [pickedAccountId, setPickedAccountId] = useState<string | null>(null);

  if (loading) {
    return <StatusMessage>Loading accounts…</StatusMessage>;
  }
  if (error) {
    return <StatusMessage tone="error">Couldn&apos;t load accounts: {error.message}</StatusMessage>;
  }
  if (accounts.length === 0) {
    return <StatusMessage>This client has no accounts.</StatusMessage>;
  }

  const accountId = pickedAccountId ?? accounts[0].id;

  return (
    // `relative` anchors the bulk action bar rendered inside AccountTransactionList.
    <div className="relative flex flex-col gap-4">
      <AccountSelect
        accounts={accounts}
        selectedAccountId={accountId}
        onChange={setPickedAccountId}
      />
      {/* Keyed by account so switching accounts resets loaded rows, selection and approvals. */}
      <AccountTransactionList
        key={accountId}
        accountId={accountId}
        confidence={confidence}
        categoryNamesById={categoryNamesById}
        payeeNamesById={payeeNamesById}
        enableBulkSelection={enableBulkSelection}
      />
    </div>
  );
}
