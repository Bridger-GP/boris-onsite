import type { NamedEntity } from "@/client/transactions/apiTypes";

type AccountSelectProps = {
  accounts: NamedEntity[];
  selectedAccountId: string;
  onChange: (accountId: string) => void;
};

// Dropdown for choosing which bank account's transactions to show.
export function AccountSelect({
  accounts,
  selectedAccountId,
  onChange,
}: AccountSelectProps) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="font-medium text-gray-600 dark:text-gray-400">Account</span>
      <select
        className="rounded-md border border-gray-300 bg-white px-2 py-1.5 dark:border-gray-600 dark:bg-gray-900"
        value={selectedAccountId}
        onChange={(event) => onChange(event.target.value)}
      >
        {accounts.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name}
          </option>
        ))}
      </select>
    </label>
  );
}
