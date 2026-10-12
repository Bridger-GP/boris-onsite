import { useState } from "react";
import { getPairBlocker } from "@/client/transactions/editability";
import { usePairMutations } from "@/client/transactions/hooks/usePairMutations";
import type { ReferenceData, TransactionRow } from "@/client/transactions/types";
import { Button } from "@/components/Button/Button";
import { EntitySelect } from "@/components/EntitySelect/EntitySelect";
import { Modal } from "@/components/Modal/Modal";
import { PairCandidateList } from "@/components/PairCandidateList/PairCandidateList";
import { TransactionSummary } from "@/components/TransactionSummary/TransactionSummary";

type PairPickerModalProps = {
  transaction: TransactionRow;
  referenceData: ReferenceData;
  onClose: () => void;
};

// Dialog for pairing a transaction: pick another account, pick one of its transactions, save.
export function PairPickerModal({ transaction, referenceData, onClose }: PairPickerModalProps) {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { pair, pairing, error } = usePairMutations();

  // A transfer's other side lives in a different account, so the transaction's own account isn't offered.
  const otherAccounts = referenceData.accounts.filter((account) => account.id !== transaction.accountId);
  // The transaction itself may not be pairable (e.g. it's split); explain instead of showing the picker.
  const sourceBlocker = getPairBlocker(transaction);

  // Switching accounts invalidates the selected row, which belonged to the previous account.
  function handleAccountChange(nextAccountId: string | null) {
    setAccountId(nextAccountId);
    setSelectedId(null);
  }

  async function handleSave() {
    if (selectedId === null) {
      return;
    }
    const succeeded = await pair(transaction.id, selectedId);
    if (succeeded) {
      onClose();
    }
  }

  const footer = (
    <>
      <Button onClick={onClose}>Cancel</Button>
      <Button variant="primary" disabled={selectedId === null || pairing} onClick={handleSave}>
        {pairing ? "Saving…" : "Save"}
      </Button>
    </>
  );

  return (
    <Modal title="Pair transaction" onClose={onClose} footer={footer} size="lg">
      <div className="flex flex-col gap-4">
        <TransactionSummary transaction={transaction} />
        {sourceBlocker !== null ? (
          <p className="text-gray-500">This transaction can&apos;t be paired: {sourceBlocker.toLowerCase()}.</p>
        ) : (
          <>
            <EntitySelect
              label="Account to pair with"
              options={otherAccounts}
              value={accountId}
              placeholder="Select an account"
              onChange={handleAccountChange}
            />
            {accountId !== null && (
              // Keyed by account so the list (and its "load more" state) starts fresh for each account.
              <PairCandidateList
                key={accountId}
                accountId={accountId}
                referenceData={referenceData}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            )}
          </>
        )}
        {error && <p className="text-red-700 dark:text-red-300">{error.message}</p>}
      </div>
    </Modal>
  );
}
