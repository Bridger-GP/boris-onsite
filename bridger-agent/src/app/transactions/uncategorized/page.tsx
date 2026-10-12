import { TransactionListView } from "@/components/TransactionListView/TransactionListView";

// Low-confidence transactions that need individual review.
export default function UncategorizedTransactionsPage() {
  return <TransactionListView confidence="LOW" />;
}
