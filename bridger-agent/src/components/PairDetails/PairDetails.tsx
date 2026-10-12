import { formatAmount, formatDate } from "@/client/transactions/format";
import { useTransactionById } from "@/client/transactions/hooks/useTransactionById";
import type { ReferenceData } from "@/client/transactions/types";
import { TransactionStateBadge } from "@/components/TransactionStateBadge/TransactionStateBadge";

type PairDetailsProps = {
  pairTransactionId: string;
  referenceData: ReferenceData;
};

// Loads and shows the other side of a pair, in a transaction's expanded sub-row.
// It's only mounted while the row is expanded, so collapsed rows don't fetch anything.
export function PairDetails({ pairTransactionId, referenceData }: PairDetailsProps) {
  const { transaction: partner, loading, error } = useTransactionById(pairTransactionId);

  if (loading) {
    return <span className="text-gray-500">Loading paired transaction…</span>;
  }
  if (error) {
    return <span className="text-red-700 dark:text-red-300">Couldn&apos;t load the paired transaction: {error.message}</span>;
  }
  if (partner === null) {
    return <span className="text-red-700 dark:text-red-300">The paired transaction couldn&apos;t be found.</span>;
  }

  const accountName = referenceData.accounts.find((account) => account.id === partner.accountId)?.name;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      <span className="font-medium text-gray-700 dark:text-gray-300">
        Paired with{accountName ? ` · ${accountName}` : ""}
      </span>
      <span className="font-mono text-xs text-gray-600 dark:text-gray-400">{partner.externalId}</span>
      <span>{formatDate(partner.date)}</span>
      <span>{partner.description}</span>
      <span className={`tabular-nums ${partner.amountCents < 0 ? "text-red-600" : ""}`}>
        {formatAmount(partner.amountCents)}
      </span>
      <TransactionStateBadge state={partner.state} />
    </div>
  );
}
