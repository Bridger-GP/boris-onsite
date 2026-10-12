import type { TransactionRow } from "@/client/transactions/types";
import { Button } from "@/components/Button/Button";
import { Modal } from "@/components/Modal/Modal";
import { TransactionSummary } from "@/components/TransactionSummary/TransactionSummary";

type PairTransactionModalProps = {
  transaction: TransactionRow;
  onClose: () => void;
};

// Stub dialog for pairing an unpaired transaction, or unpairing a paired one.
export function PairTransactionModal({
  transaction,
  onClose,
}: PairTransactionModalProps) {
  const isUnpairing = transaction.isPaired;
  const title = isUnpairing ? "Unpair transaction" : "Pair transaction";
  const placeholder = isUnpairing
    ? "Unpair confirmation coming soon."
    : "Picker for the matching transaction coming soon.";

  const footer = (
    <>
      <Button onClick={onClose}>Cancel</Button>
      <Button variant="primary" onClick={onClose}>
        {isUnpairing ? "Unpair" : "Pair"}
      </Button>
    </>
  );

  return (
    <Modal title={title} onClose={onClose} footer={footer}>
      <TransactionSummary transaction={transaction} />
      <p className="mt-4 text-gray-500">{placeholder}</p>
    </Modal>
  );
}
