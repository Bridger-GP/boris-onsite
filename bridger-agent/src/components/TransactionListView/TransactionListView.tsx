"use client";

import { getClientId } from "@/client/config";
import type { Confidence } from "@/client/transactions/apiTypes";
import { ClientTransactionListView } from "@/components/ClientTransactionListView/ClientTransactionListView";
import { StatusMessage } from "@/components/StatusMessage/StatusMessage";

export type TransactionListViewProps = {
  // HIGH = categorized view, LOW = uncategorized view.
  confidence: Confidence;
  // Enables row checkboxes and the bulk-approve toolbar.
  enableBulkSelection?: boolean;
};

// Entry point for a transaction review view. Checks the client ID is configured before loading anything.
export function TransactionListView(props: TransactionListViewProps) {
  const clientId = getClientId();

  if (clientId === null) {
    return (
      <StatusMessage tone="error">
        NEXT_PUBLIC_CLIENT_ID is not set. Copy .env.example to .env.local, fill it in, and restart the dev server.
      </StatusMessage>
    );
  }

  return <ClientTransactionListView clientId={clientId} {...props} />;
}
