import { useState } from "react";
import type { ReferenceData, TransactionRow } from "@/client/transactions/types";
import { PairPickerModal } from "@/components/PairPickerModal/PairPickerModal";
import { UnpairModal } from "@/components/UnpairModal/UnpairModal";

type PairTransactionModalProps = {
  transaction: TransactionRow;
  referenceData: ReferenceData;
  onClose: () => void;
};

// Opens the Unpair dialog for a paired transaction, or the pair picker for an unpaired one.
export function PairTransactionModal({ transaction, referenceData, onClose }: PairTransactionModalProps) {
  // Decide the mode once, when the dialog opens. The live row flips isPaired as soon as a (un)pair
  // succeeds, and we don't want the dialog to switch modes in the moment before it closes.
  const [pairTransactionIdAtOpen] = useState(transaction.pairTransactionId);

  if (pairTransactionIdAtOpen !== null) {
    return (
      <UnpairModal
        transaction={transaction}
        pairTransactionId={pairTransactionIdAtOpen}
        referenceData={referenceData}
        onClose={onClose}
      />
    );
  }

  return <PairPickerModal transaction={transaction} referenceData={referenceData} onClose={onClose} />;
}
