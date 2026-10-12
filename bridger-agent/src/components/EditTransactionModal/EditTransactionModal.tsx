import { useEditTransactionForm } from "@/client/transactions/hooks/useEditTransactionForm";
import { useReviewPayee } from "@/client/transactions/hooks/useReviewPayee";
import { useSplitEditor } from "@/client/transactions/hooks/useSplitEditor";
import { useSubmitTransaction } from "@/client/transactions/hooks/useSubmitTransaction";
import type { ReferenceData, TransactionRow } from "@/client/transactions/types";
import { Button } from "@/components/Button/Button";
import { EditTransactionForm } from "@/components/EditTransactionForm/EditTransactionForm";
import { Modal } from "@/components/Modal/Modal";
import { SplitEditor } from "@/components/SplitEditor/SplitEditor";
import { TransactionSummary } from "@/components/TransactionSummary/TransactionSummary";
import { UnreviewedPayeeNotice } from "@/components/UnreviewedPayeeNotice/UnreviewedPayeeNotice";

type EditTransactionModalProps = {
  transaction: TransactionRow;
  referenceData: ReferenceData;
  onClose: () => void;
};

// Dialog for setting a transaction's category and payee, and editing its split.
// "Save & mark reviewed" submits the category/payee (submitTransaction); splits are saved by their own buttons.
// `transaction` should be the live row from the list, so split changes show up without reopening the dialog.
export function EditTransactionModal({
  transaction,
  referenceData,
  onClose,
}: EditTransactionModalProps) {
  const form = useEditTransactionForm(transaction);
  const { submit, submitting, error: submitError } = useSubmitTransaction();
  const { reviewPayee, reviewingPayee, reviewPayeeError } = useReviewPayee();
  const splitEditor = useSplitEditor(transaction);

  // Unsaved split edits would be silently dropped by submitting, so make the user save or discard them first.
  const isBlockedBySplitEdits = splitEditor.hasUnsavedChanges;

  // Look up the selected payee in the (cached) list, so its `reviewed` flag updates live after reviewPayee.
  const selectedPayee = referenceData.payees.find((payee) => payee.id === form.payeeId);

  async function handleSave() {
    try {
      await submit({
        transactionId: transaction.id,
        categoryId: form.categoryIdToSubmit,
        payeeId: form.payeeId,
      });
      onClose();
    } catch {
      // Keep the dialog open; the error is shown from `submitError`.
    }
  }

  const footer = (
    <>
      <Button onClick={onClose}>Cancel</Button>
      <Button variant="primary" disabled={!form.canSubmit || isBlockedBySplitEdits || submitting} onClick={handleSave}>
        {submitting ? "Saving…" : "Save & mark reviewed"}
      </Button>
    </>
  );

  return (
    <Modal title="Edit transaction" onClose={onClose} footer={footer} size="lg">
      <div className="flex flex-col gap-4">
        <TransactionSummary transaction={transaction} />
        {!form.isEditable && (
          <p className="text-gray-500">This transaction has already been processed and can no longer be edited.</p>
        )}
        <EditTransactionForm
          clientId={referenceData.clientId}
          categories={referenceData.categories}
          payees={referenceData.payees}
          categoryId={form.categoryId}
          payeeId={form.payeeId}
          onCategoryChange={form.setCategoryId}
          onPayeeChange={form.setPayeeId}
          isSplit={transaction.isSplit}
          disabled={!form.isEditable || submitting}
        />
        {selectedPayee && !selectedPayee.reviewed && (
          <UnreviewedPayeeNotice
            payeeName={selectedPayee.name}
            reviewing={reviewingPayee}
            errorMessage={reviewPayeeError?.message}
            onMarkReviewed={() => reviewPayee(selectedPayee.id)}
          />
        )}
        <SplitEditor
          transaction={transaction}
          referenceData={referenceData}
          editor={splitEditor}
          isEditable={form.isEditable}
        />
        {isBlockedBySplitEdits && (
          <p className="text-gray-500">Save or discard your split changes before marking the transaction reviewed.</p>
        )}
        {submitError && <p className="text-red-700 dark:text-red-300">{submitError.message}</p>}
      </div>
    </Modal>
  );
}
