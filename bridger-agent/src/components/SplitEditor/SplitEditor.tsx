import type { SplitEditor as SplitEditorState } from "@/client/transactions/hooks/useSplitEditor";
import { useSplitMutations } from "@/client/transactions/hooks/useSplitMutations";
import type { ReferenceData, TransactionRow } from "@/client/transactions/types";
import { SplitEditorBody } from "@/components/SplitEditorBody/SplitEditorBody";

export type SplitEditorProps = {
  transaction: TransactionRow;
  referenceData: ReferenceData;
  // Draft state lives in the dialog (useSplitEditor), so it can block submitting while edits are unsaved.
  editor: SplitEditorState;
  // False once the transaction is processed: the split is shown read-only.
  isEditable: boolean;
};

// "Split" section of the Edit dialog. Split edits are saved by their own buttons, separately from
// "Save & mark reviewed", because splitting doesn't change the transaction's state.
export function SplitEditor({ transaction, referenceData, editor, isEditable }: SplitEditorProps) {
  const mutations = useSplitMutations();

  async function handleSave() {
    await mutations.saveSplit(transaction.id, editor.toSplitInputs());
  }

  async function handleDelete() {
    const succeeded = await mutations.removeSplit(transaction.id);
    if (succeeded) {
      editor.clear();
    }
  }

  return (
    <section className="flex flex-col gap-2">
      <h3 className="font-medium text-gray-700 dark:text-gray-300">Split</h3>
      <SplitEditorBody
        transaction={transaction}
        referenceData={referenceData}
        editor={editor}
        isEditable={isEditable}
        mutations={mutations}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      {mutations.error && <p className="text-red-700 dark:text-red-300">{mutations.error.message}</p>}
    </section>
  );
}
