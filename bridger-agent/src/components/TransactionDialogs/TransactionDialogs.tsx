import type { TransactionDialogState } from "@/client/transactions/hooks/useTransactionDialog";
import type { ReferenceData } from "@/client/transactions/types";
import { EditTransactionModal } from "@/components/EditTransactionModal/EditTransactionModal";
import { PairTransactionModal } from "@/components/PairTransactionModal/PairTransactionModal";

type TransactionDialogsProps = {
  dialog: TransactionDialogState;
  referenceData: ReferenceData;
  onClose: () => void;
};

// Renders whichever per-row dialog is currently open, if any.
export function TransactionDialogs({
  dialog,
  referenceData,
  onClose,
}: TransactionDialogsProps) {
  if (dialog === null) {
    return null;
  }

  if (dialog.kind === "edit") {
    return (
      <EditTransactionModal
        transaction={dialog.transaction}
        referenceData={referenceData}
        onClose={onClose}
      />
    );
  }

  return (
    <PairTransactionModal
      transaction={dialog.transaction}
      referenceData={referenceData}
      onClose={onClose}
    />
  );
}
