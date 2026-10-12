import type { ReactNode } from "react";
import { TransactionsNav } from "@/components/TransactionsNav/TransactionsNav";

// Shared shell for the transaction review views: heading plus tab navigation.
export default function TransactionsLayout({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold">Transactions</h1>
      <TransactionsNav />
      {children}
    </main>
  );
}
