import { useMutation } from "@apollo/client";
import type {
  PairTransactionsResult,
  PairTransactionsVariables,
  UnpairTransactionsResult,
} from "../apiTypes";
import { PAIR_TRANSACTIONS, UNPAIR_TRANSACTIONS } from "../transactions.api";

// Pairs or unpairs two transactions. Both mutations return both sides, so Apollo updates
// both rows' cached pairTransactionId automatically. Neither changes the transactions' state.
export function usePairMutations() {
  const [pairMutation, pairState] = useMutation<PairTransactionsResult, PairTransactionsVariables>(
    PAIR_TRANSACTIONS,
  );
  const [unpairMutation, unpairState] = useMutation<
    UnpairTransactionsResult,
    PairTransactionsVariables
  >(UNPAIR_TRANSACTIONS);

  // Returns true on success; on failure the reason is in `error`.
  async function pair(firstTransactionId: string, secondTransactionId: string): Promise<boolean> {
    try {
      await pairMutation({ variables: { firstTransactionId, secondTransactionId } });
      return true;
    } catch {
      return false;
    }
  }

  // Returns true on success; on failure the reason is in `error`.
  async function unpair(firstTransactionId: string, secondTransactionId: string): Promise<boolean> {
    try {
      await unpairMutation({ variables: { firstTransactionId, secondTransactionId } });
      return true;
    } catch {
      return false;
    }
  }

  return {
    pair,
    unpair,
    pairing: pairState.loading,
    unpairing: unpairState.loading,
    error: pairState.error ?? unpairState.error,
  };
}
