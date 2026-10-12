import { Button } from "@/components/Button/Button";

type RowActionsProps = {
  isPaired: boolean;
  onEdit: () => void;
  onPair: () => void;
};

// Per-row action buttons: Edit, and Pair or Unpair depending on the current pairing.
export function RowActions({ isPaired, onEdit, onPair }: RowActionsProps) {
  const pairLabel = isPaired ? "Unpair" : "Pair";

  return (
    <div className="flex justify-end gap-1">
      <Button variant="ghost" onClick={onEdit}>
        Edit
      </Button>
      <Button variant="ghost" onClick={onPair}>
        {pairLabel}
      </Button>
    </div>
  );
}
