import type { useSplitMutations } from "@/client/transactions/hooks/useSplitMutations";
import { Button } from "@/components/Button/Button";
import type { SplitEditorProps } from "@/components/SplitEditor/SplitEditor";
import { SplitEditorActions } from "@/components/SplitEditorActions/SplitEditorActions";
import { SplitTable } from "@/components/SplitTable/SplitTable";

type SplitEditorBodyProps = SplitEditorProps & {
  mutations: ReturnType<typeof useSplitMutations>;
  onSave: () => void;
  onDelete: () => void;
};

// Picks what the section shows: a note, an "Add split" button, or the split table and its actions.
export function SplitEditorBody({
  transaction,
  referenceData,
  editor,
  isEditable,
  mutations,
  onSave,
  onDelete,
}: SplitEditorBodyProps) {
  if (editor.lines === null) {
    if (transaction.isPaired) {
      return <p className="text-gray-500">Paired transactions can&apos;t be split. Unpair it first.</p>;
    }
    if (!isEditable) {
      return <p className="text-gray-500">Not split.</p>;
    }
    return (
      <div>
        <Button onClick={editor.startSplit}>Add split</Button>
      </div>
    );
  }

  return (
    <>
      <SplitTable
        lines={editor.lines}
        categories={referenceData.categories}
        payees={referenceData.payees}
        totalCents={editor.totalCents}
        remainingCents={editor.remainingCents}
        onChangeLine={editor.updateLine}
        onRemoveLine={editor.removeLine}
        disabled={!isEditable}
      />
      {isEditable && (
        <>
          {editor.hasUnsavedChanges && !editor.isValid && (
            <p className="text-gray-500">{editor.problems.join(" ")}</p>
          )}
          <SplitEditorActions
            isSavedSplit={transaction.isSplit}
            canSave={editor.isValid}
            hasUnsavedChanges={editor.hasUnsavedChanges}
            saving={mutations.saving}
            removing={mutations.removing}
            onAddLine={editor.addLine}
            onDiscard={editor.discardChanges}
            onDelete={onDelete}
            onSave={onSave}
          />
        </>
      )}
    </>
  );
}
