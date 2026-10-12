import { useMutation } from "@apollo/client";
import type {
  SplitInput,
  SplitTransactionResult,
  SplitTransactionVariables,
  UnsplitTransactionResult,
  UnsplitTransactionVariables,
} from "../apiTypes";
import { SPLIT_TRANSACTION, UNSPLIT_TRANSACTION } from "../transactions.api";

// Saves or removes a transaction's split. Neither changes the transaction's state.
// Both return the updated transaction, so Apollo refreshes its cached splits automatically.
export function useSplitMutations() {
  const [splitMutation, splitState] = useMutation<
    SplitTransactionResult,
    SplitTransactionVariables
  >(SPLIT_TRANSACTION);
  const [unsplitMutation, unsplitState] = useMutation<
    UnsplitTransactionResult,
    UnsplitTransactionVariables
  >(UNSPLIT_TRANSACTION);

  // Returns true on success; on failure the reason is in `error`.
  async function saveSplit(transactionId: string, splits: SplitInput[]): Promise<boolean> {
    // Clear a stale error from the other mutation so only the latest failure shows.
    unsplitState.reset();
    try {
      await splitMutation({ variables: { transactionId, splits } });
      return true;
    } catch {
      return false;
    }
  }

  // Returns true on success; on failure the reason is in `error`.
  async function removeSplit(transactionId: string): Promise<boolean> {
    splitState.reset();
    try {
      await unsplitMutation({ variables: { transactionId } });
      return true;
    } catch {
      return false;
    }
  }

  return {
    saveSplit,
    removeSplit,
    saving: splitState.loading,
    removing: unsplitState.loading,
    error: splitState.error ?? unsplitState.error,
  };
}
