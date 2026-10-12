import { useState } from "react";
import type { ApiSplit, SplitInput } from "../apiTypes";
import { centsToDollarInput, parseDollarInput } from "../format";
import type { TransactionRow } from "../types";

// One editable line of a split. Amounts are typed as positive dollars; the transaction's sign is applied on save.
export type SplitDraftLine = {
  // Stable React key (server split IDs change on every save, and new lines don't have one).
  key: string;
  categoryId: string | null;
  payeeId: string | null;
  amountInput: string;
};

export type SplitEditor = ReturnType<typeof useSplitEditor>;

let lastLineKey = 0;
function nextLineKey(): string {
  lastLineKey += 1;
  return `split-line-${lastLineKey}`;
}

// Turns the server's split lines into editable draft lines.
function toDraftLines(splits: ApiSplit[]): SplitDraftLine[] {
  return splits.map((split) => ({
    key: nextLineKey(),
    categoryId: split.categoryId,
    payeeId: split.payeeId,
    amountInput: centsToDollarInput(split.amountCents),
  }));
}

// Order-insensitive fingerprint of a set of split lines, for detecting unsaved changes.
function toComparableKey(splits: SplitInput[]): string {
  const lineKeys = splits.map((split) => `${split.categoryId}|${split.payeeId ?? ""}|${split.amountCents}`);
  lineKeys.sort();
  return lineKeys.join(";");
}

// Draft state for the split table in the Edit dialog.
// `lines` is null when the transaction isn't split and the user hasn't started a split.
export function useSplitEditor(transaction: TransactionRow) {
  const [lines, setLines] = useState<SplitDraftLine[] | null>(() =>
    transaction.isSplit ? toDraftLines(transaction.splits) : null,
  );

  const totalCents = Math.abs(transaction.amountCents);
  const sign = transaction.amountCents < 0 ? -1 : 1;

  // Starts a new split: the first line carries the full amount and the current category/payee.
  function startSplit() {
    setLines([
      {
        key: nextLineKey(),
        categoryId: transaction.categoryId,
        payeeId: transaction.payeeId,
        amountInput: centsToDollarInput(transaction.amountCents),
      },
      { key: nextLineKey(), categoryId: null, payeeId: transaction.payeeId, amountInput: "" },
    ]);
  }

  function addLine() {
    setLines((previous) => [
      ...(previous ?? []),
      { key: nextLineKey(), categoryId: null, payeeId: transaction.payeeId, amountInput: "" },
    ]);
  }

  function removeLine(key: string) {
    setLines((previous) => (previous ?? []).filter((line) => line.key !== key));
  }

  function updateLine(key: string, changes: Partial<Omit<SplitDraftLine, "key">>) {
    setLines((previous) =>
      (previous ?? []).map((line) => (line.key === key ? { ...line, ...changes } : line)),
    );
  }

  // Throws away unsaved edits, going back to what the server has.
  function discardChanges() {
    setLines(transaction.isSplit ? toDraftLines(transaction.splits) : null);
  }

  // Called after the split was deleted on the server.
  function clear() {
    setLines(null);
  }

  // --- Derived values ---------------------------------------------------------

  const draftLines = lines ?? [];
  const parsedAmounts = draftLines.map((line) => parseDollarInput(line.amountInput));
  const allocatedCents = parsedAmounts.reduce<number>((sum, cents) => sum + (cents ?? 0), 0);
  const remainingCents = totalCents - allocatedCents;

  // Mirrors the server's rules: at least two lines, each with a category and a positive amount, summing to the total.
  const problems: string[] = [];
  if (draftLines.length < 2) {
    problems.push("A split needs at least two lines.");
  }
  if (draftLines.some((line) => line.categoryId === null)) {
    problems.push("Every line needs a category.");
  }
  if (parsedAmounts.some((cents) => cents === null || cents === 0)) {
    problems.push("Every line needs an amount greater than zero.");
  }
  if (remainingCents !== 0) {
    problems.push("Line amounts must add up to the transaction amount.");
  }

  // Builds the API payload, applying the transaction's sign to each line.
  function toSplitInputs(): SplitInput[] {
    return draftLines.map((line, index) => ({
      categoryId: line.categoryId ?? "",
      payeeId: line.payeeId,
      amountCents: sign * (parsedAmounts[index] ?? 0),
    }));
  }

  // Unsaved if the draft differs from the server's split (or a new split was started).
  // Compared ignoring line order, since the server may return lines in a different order than we sent.
  const savedInputs = transaction.splits.map((split) => ({
    categoryId: split.categoryId ?? "",
    payeeId: split.payeeId,
    amountCents: split.amountCents,
  }));
  const hasUnsavedChanges =
    lines !== null && toComparableKey(toSplitInputs()) !== toComparableKey(savedInputs);

  return {
    lines,
    totalCents,
    remainingCents,
    problems,
    isValid: problems.length === 0,
    hasUnsavedChanges,
    startSplit,
    addLine,
    removeLine,
    updateLine,
    discardChanges,
    clear,
    toSplitInputs,
  };
}
