import { TransactionListView } from "@/components/TransactionListView/TransactionListView";

// High-confidence suggestions, which can be bulk approved.
export default function CategorizedTransactionsPage() {
  return <TransactionListView confidence="HIGH" enableBulkSelection />;
}
