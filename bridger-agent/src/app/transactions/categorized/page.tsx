import { MOCK_CATEGORIZED_TRANSACTIONS } from "@/client/transactions/mockTransactions";
import { TransactionListView } from "@/components/TransactionListView/TransactionListView";

export default function CategorizedTransactionsPage() {
  return (
    <TransactionListView
      initialTransactions={MOCK_CATEGORIZED_TRANSACTIONS}
      enableBulkSelection
    />
  );
}
