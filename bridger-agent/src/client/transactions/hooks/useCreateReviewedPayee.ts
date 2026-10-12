import { useMutation } from "@apollo/client";
import { useState } from "react";
import type {
  ApiPayee,
  ClientReferenceDataResult,
  CreatePayeeResult,
  CreatePayeeVariables,
  ReviewPayeeResult,
  ReviewPayeeVariables,
} from "../apiTypes";
import { CLIENT_REFERENCE_DATA, CREATE_PAYEE, REVIEW_PAYEE } from "../transactions.api";

// Creates a payee typed in by the user and immediately marks it reviewed (a human entered it).
// The new payee is added to the cached payee list, so every payee dropdown picks it up.
export function useCreateReviewedPayee(clientId: string) {
  const [createPayeeMutation] = useMutation<CreatePayeeResult, CreatePayeeVariables>(
    CREATE_PAYEE,
    {
      // createPayee returns a new object the cached list doesn't know about, so append it ourselves.
      update(cache, { data }) {
        const created = data?.createPayee;
        if (!created) {
          return;
        }
        cache.updateQuery<ClientReferenceDataResult>(
          { query: CLIENT_REFERENCE_DATA, variables: { clientId } },
          (existing) => {
            if (!existing) {
              return existing;
            }
            const payees = [...existing.payees, created];
            payees.sort((first, second) => first.name.localeCompare(second.name));
            return { ...existing, payees };
          },
        );
      },
    },
  );
  const [reviewPayeeMutation] = useMutation<ReviewPayeeResult, ReviewPayeeVariables>(
    REVIEW_PAYEE,
  );

  const [creating, setCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Returns the new (reviewed) payee, or null on failure (see `errorMessage`).
  // These are two separate calls: if the review step fails, the payee exists but stays unreviewed,
  // and the dialog's "Mark as reviewed" notice lets the user retry.
  async function createReviewedPayee(name: string): Promise<ApiPayee | null> {
    setCreating(true);
    setErrorMessage(null);
    try {
      const created = await createPayeeMutation({ variables: { clientId, name } });
      const payee = created.data?.createPayee;
      if (!payee) {
        throw new Error("The server didn't return the new payee");
      }
      await reviewPayeeMutation({ variables: { payeeId: payee.id } });
      return { ...payee, reviewed: true };
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Couldn't create the payee");
      return null;
    } finally {
      setCreating(false);
    }
  }

  return { createReviewedPayee, creating, errorMessage };
}
