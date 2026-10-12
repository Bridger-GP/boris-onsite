import { Button } from "@/components/Button/Button";

type SplitEditorActionsProps = {
  // Whether the transaction is split on the server (so there is something to delete).
  isSavedSplit: boolean;
  canSave: boolean;
  hasUnsavedChanges: boolean;
  saving: boolean;
  removing: boolean;
  onAddLine: () => void;
  onDiscard: () => void;
  onDelete: () => void;
  onSave: () => void;
};

// Buttons under the split table: add a line on the left; discard / delete / save on the right.
export function SplitEditorActions({
  isSavedSplit,
  canSave,
  hasUnsavedChanges,
  saving,
  removing,
  onAddLine,
  onDiscard,
  onDelete,
  onSave,
}: SplitEditorActionsProps) {
  const isBusy = saving || removing;

  // For a split that isn't saved yet, "discard" means abandoning it entirely.
  const discardLabel = isSavedSplit ? "Discard changes" : "Cancel split";
  const showDiscard = hasUnsavedChanges || !isSavedSplit;

  return (
    <div className="flex items-center justify-between gap-2">
      <Button variant="ghost" onClick={onAddLine} disabled={isBusy} className="-ml-3">
        + Add line
      </Button>
      <div className="flex gap-2">
        {showDiscard && (
          <Button onClick={onDiscard} disabled={isBusy}>
            {discardLabel}
          </Button>
        )}
        {isSavedSplit && (
          <Button onClick={onDelete} disabled={isBusy} className="text-red-700 dark:text-red-300">
            {removing ? "Deleting…" : "Delete split"}
          </Button>
        )}
        <Button variant="primary" onClick={onSave} disabled={!canSave || !hasUnsavedChanges || isBusy}>
          {saving ? "Saving…" : "Save split"}
        </Button>
      </div>
    </div>
  );
}
