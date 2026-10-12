import { useQuery } from "@apollo/client";
import type { TransactionByIdResult, TransactionByIdVariables } from "../apiTypes";
import { TRANSACTION_BY_ID } from "../transactions.api";

// Loads a single transaction by ID, e.g. the other side of a pair (which may be in another account).
export function useTransactionById(id: string) {
  const { data, loading, error } = useQuery<TransactionByIdResult, TransactionByIdVariables>(
    TRANSACTION_BY_ID,
    { variables: { id } },
  );

  return {
    transaction: data?.transaction ?? null,
    loading,
    error,
  };
}
