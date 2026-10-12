import type { ReactNode } from "react";
import type { TransactionRow } from "@/client/transactions/types";
import { TransactionSummary } from "@/components/TransactionSummary/TransactionSummary";

type PairSideSummaryProps = {
  title: string;
  accountName?: string;
  // null while the transaction is loading or missing; `status` explains which.
  transaction: TransactionRow | null;
  status?: ReactNode;
};

// One side of a pair in the Unpair dialog: "Title · Account" heading plus the transaction summary.
export function PairSideSummary({ title, accountName, transaction, status }: PairSideSummaryProps) {
  let heading = title;
  if (accountName) {
    heading = `${title} · ${accountName}`;
  }

  return (
    <section className="flex flex-col gap-2">
      <h3 className="font-medium text-gray-700 dark:text-gray-300">{heading}</h3>
      {transaction ? <TransactionSummary transaction={transaction} /> : status}
    </section>
  );
}
