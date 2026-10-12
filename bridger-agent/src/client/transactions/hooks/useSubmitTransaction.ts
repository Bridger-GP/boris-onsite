import { useMutation } from "@apollo/client";
import { TransactionState } from "@/server/modules/transactions/transactionState";
import type {
  SubmitTransactionResult,
  SubmitTransactionVariables,
} from "../apiTypes";
import { SUBMIT_TRANSACTION } from "../transactions.api";

// Saves a transaction's category/payee and marks it REVIEWED.
// Apollo updates the submitted transaction in the cache from the response automatically.
export function useSubmitTransaction() {
  const [mutate, { loading, error }] = useMutation<
    SubmitTransactionResult,
    SubmitTransactionVariables
  >(SUBMIT_TRANSACTION, {
    // The server also marks the pair partner REVIEWED but doesn't return it,
    // so update the partner's cached state ourselves (a no-op if it isn't loaded).
    update(cache, { data }) {
      const partnerId = data?.submitTransaction.pairTransactionId;
      if (!partnerId) {
        return;
      }
      cache.modify({
        id: cache.identify({ __typename: "Transaction", id: partnerId }),
        fields: { state: () => TransactionState.REVIEWED },
      });
    },
  });

  // Resolves on success; rejects on failure (the error is also exposed as `error`).
  async function submit(variables: SubmitTransactionVariables) {
    await mutate({ variables });
  }

  return { submit, submitting: loading, error };
}
