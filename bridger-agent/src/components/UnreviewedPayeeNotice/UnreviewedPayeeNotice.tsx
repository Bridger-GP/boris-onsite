import { Button } from "@/components/Button/Button";

type UnreviewedPayeeNoticeProps = {
  payeeName: string;
  reviewing: boolean;
  // Message from a failed review attempt, if any.
  errorMessage?: string;
  onMarkReviewed: () => void;
};

// Warns that the selected payee hasn't been confirmed by a human, with a button to confirm it.
export function UnreviewedPayeeNotice({
  payeeName,
  reviewing,
  errorMessage,
  onMarkReviewed,
}: UnreviewedPayeeNoticeProps) {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
      <div className="flex items-center justify-between gap-4">
        <p>
          <span className="font-medium">{payeeName}</span> hasn&apos;t been reviewed yet.
          Confirm it&apos;s a real payee before relying on it.
        </p>
        <Button disabled={reviewing} onClick={onMarkReviewed} className="shrink-0">
          {reviewing ? "Marking…" : "Mark as reviewed"}
        </Button>
      </div>
      {errorMessage && <p className="text-red-700 dark:text-red-300">{errorMessage}</p>}
    </div>
  );
}
