import type { TransactionRow } from "@/client/transactions/types";
import { Button } from "@/components/Button/Button";
import { Modal } from "@/components/Modal/Modal";
import { TransactionSummary } from "@/components/TransactionSummary/TransactionSummary";

type EditTransactionModalProps = {
  transaction: TransactionRow;
  onClose: () => void;
};

// Stub dialog for editing a transaction. The real form (category, payee, splits...) comes later.
export function EditTransactionModal({
  transaction,
  onClose,
}: EditTransactionModalProps) {
  const footer = (
    <>
      <Button onClick={onClose}>Cancel</Button>
      <Button variant="primary" onClick={onClose}>
        Save
      </Button>
    </>
  );

  return (
    <Modal title="Edit transaction" onClose={onClose} footer={footer}>
      <TransactionSummary transaction={transaction} />
      <p className="mt-4 text-gray-500">Edit form coming soon.</p>
    </Modal>
  );
}
