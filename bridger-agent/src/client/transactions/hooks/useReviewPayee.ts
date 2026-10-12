import { useMutation } from "@apollo/client";
import type { ReviewPayeeResult, ReviewPayeeVariables } from "../apiTypes";
import { REVIEW_PAYEE } from "../transactions.api";

// Marks a payee as reviewed. The returned Payee updates the cached payee list automatically.
export function useReviewPayee() {
  const [mutate, { loading, error }] = useMutation<
    ReviewPayeeResult,
    ReviewPayeeVariables
  >(REVIEW_PAYEE);

  function reviewPayee(payeeId: string) {
    // Failures are surfaced through `error`; swallow the rejection so callers needn't catch.
    mutate({ variables: { payeeId } }).catch(() => {});
  }

  return { reviewPayee, reviewingPayee: loading, reviewPayeeError: error };
}
