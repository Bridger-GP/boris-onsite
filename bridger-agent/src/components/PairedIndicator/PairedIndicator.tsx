type PairedIndicatorProps = {
  isPaired: boolean;
};

// Shows whether a transaction is paired with another transaction.
export function PairedIndicator({ isPaired }: PairedIndicatorProps) {
  if (!isPaired) {
    return <span className="text-gray-400" aria-label="Not paired">—</span>;
  }

  return (
    <span
      className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800"
      title="Paired with another transaction"
    >
      <span aria-hidden>🔗</span>
      Paired
    </span>
  );
}
