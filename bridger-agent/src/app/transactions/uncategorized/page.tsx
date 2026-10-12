import { MOCK_UNCATEGORIZED_TRANSACTIONS } from "@/client/transactions/mockTransactions";
import { TransactionListView } from "@/components/TransactionListView/TransactionListView";

export default function UncategorizedTransactionsPage() {
  return <TransactionListView initialTransactions={MOCK_UNCATEGORIZED_TRANSACTIONS} />;
}
