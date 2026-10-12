import { useQuery } from "@apollo/client";
import { useMemo } from "react";
import type {
  ClientReferenceDataResult,
  ClientReferenceDataVariables,
  NamedEntity,
} from "../apiTypes";
import { CLIENT_REFERENCE_DATA } from "../transactions.api";
import type { ReferenceData } from "../types";

// Loads a client's accounts, plus its categories and payees (lists and name lookups).
export function useClientReferenceData(clientId: string) {
  const { data, loading, error } = useQuery<
    ClientReferenceDataResult,
    ClientReferenceDataVariables
  >(CLIENT_REFERENCE_DATA, { variables: { clientId } });

  const referenceData = useMemo<ReferenceData>(() => {
    const accounts = data?.accounts ?? [];
    const categories = data?.categories ?? [];
    const payees = data?.payees ?? [];
    return {
      clientId,
      accounts,
      categories,
      payees,
      categoryNamesById: buildNameLookup(categories),
      payeeNamesById: buildNameLookup(payees),
    };
  }, [clientId, data?.accounts, data?.categories, data?.payees]);

  return {
    accounts: data?.accounts ?? [],
    referenceData,
    loading,
    error,
  };
}

// Builds an id -> name map.
function buildNameLookup(entities: NamedEntity[]): Map<string, string> {
  const lookup = new Map<string, string>();
  for (const entity of entities) {
    lookup.set(entity.id, entity.name);
  }
  return lookup;
}
