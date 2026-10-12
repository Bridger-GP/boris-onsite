import { isEditableState } from "@/client/transactions/editability";
import { usePairMutations } from "@/client/transactions/hooks/usePairMutations";
import { useTransactionById } from "@/client/transactions/hooks/useTransactionById";
import { toTransactionRow } from "@/client/transactions/toTransactionRow";
import type { ReferenceData, TransactionRow } from "@/client/transactions/types";
import { Button } from "@/components/Button/Button";
import { Modal } from "@/components/Modal/Modal";
import { PairSideSummary } from "@/components/PairSideSummary/PairSideSummary";
import { PartnerStatus } from "@/components/PartnerStatus/PartnerStatus";

type UnpairModalProps = {
  // Must be paired (pairTransactionId set).
  transaction: TransactionRow;
  pairTransactionId: string;
  referenceData: ReferenceData;
  onClose: () => void;
};

// Dialog showing both sides of a pair, with a button to unpair them.
export function UnpairModal({ transaction, pairTransactionId, referenceData, onClose }: UnpairModalProps) {
  const partnerQuery = useTransactionById(pairTransactionId);
  const { unpair, unpairing, error } = usePairMutations();

  const partner = partnerQuery.transaction ? toTransactionRow(partnerQuery.transaction, referenceData) : null;
  const partnerAccountName = referenceData.accounts.find((account) => account.id === partner?.accountId)?.name;
  const thisAccountName = referenceData.accounts.find((account) => account.id === transaction.accountId)?.name;

  // The server only unpairs while both sides are still editable.
  const isEditable = isEditableState(transaction.state) && (partner === null || isEditableState(partner.state));

  async function handleUnpair() {
    const succeeded = await unpair(transaction.id, pairTransactionId);
    if (succeeded) {
      onClose();
    }
  }

  const footer = (
    <>
      <Button onClick={onClose}>Cancel</Button>
      <Button variant="primary" disabled={partner === null || !isEditable || unpairing} onClick={handleUnpair}>
        {unpairing ? "Unpairing…" : "Unpair"}
      </Button>
    </>
  );

  return (
    <Modal title="Unpair transaction" onClose={onClose} footer={footer} size="lg">
      <div className="grid grid-cols-2 gap-4">
        <PairSideSummary title="This transaction" accountName={thisAccountName} transaction={transaction} />
        <PairSideSummary
          title="Paired with"
          accountName={partnerAccountName}
          transaction={partner}
          status={<PartnerStatus loading={partnerQuery.loading} errorMessage={partnerQuery.error?.message} />}
        />
      </div>
      {!isEditable && (
        <p className="mt-4 text-gray-500">One side of this pair has already been processed, so it can no longer be unpaired.</p>
      )}
      {error && <p className="mt-4 text-red-700 dark:text-red-300">{error.message}</p>}
    </Modal>
  );
}
