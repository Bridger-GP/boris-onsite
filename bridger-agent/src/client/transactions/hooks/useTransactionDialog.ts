import { useCallback, useState } from "react";
import type { TransactionRow } from "../types";

export type TransactionDialogState =
  | { kind: "edit"; transaction: TransactionRow }
  | { kind: "pair"; transaction: TransactionRow }
  | null;

// Tracks which per-row dialog (if any) is open, and for which transaction.
export function useTransactionDialog() {
  const [dialog, setDialog] = useState<TransactionDialogState>(null);

  const openEdit = useCallback((transaction: TransactionRow) => {
    setDialog({ kind: "edit", transaction });
  }, []);

  const openPair = useCallback((transaction: TransactionRow) => {
    setDialog({ kind: "pair", transaction });
  }, []);

  const close = useCallback(() => setDialog(null), []);

  return { dialog, openEdit, openPair, close };
}
