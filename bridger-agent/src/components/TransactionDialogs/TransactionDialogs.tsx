import type { TransactionDialogState } from "@/client/transactions/hooks/useTransactionDialog";
import { EditTransactionModal } from "@/components/EditTransactionModal/EditTransactionModal";
import { PairTransactionModal } from "@/components/PairTransactionModal/PairTransactionModal";

type TransactionDialogsProps = {
  dialog: TransactionDialogState;
  onClose: () => void;
};

// Renders whichever per-row dialog is currently open, if any.
export function TransactionDialogs({ dialog, onClose }: TransactionDialogsProps) {
  if (dialog === null) {
    return null;
  }

  if (dialog.kind === "edit") {
    return <EditTransactionModal transaction={dialog.transaction} onClose={onClose} />;
  }

  return <PairTransactionModal transaction={dialog.transaction} onClose={onClose} />;
}
