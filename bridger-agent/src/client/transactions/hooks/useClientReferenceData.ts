import { useQuery } from "@apollo/client";
import { useMemo } from "react";
import type {
  ClientReferenceDataResult,
  ClientReferenceDataVariables,
  NamedEntity,
} from "../apiTypes";
import { CLIENT_REFERENCE_DATA } from "../transactions.api";

// Loads a client's accounts, plus category and payee name lookups for displaying transactions.
export function useClientReferenceData(clientId: string) {
  const { data, loading, error } = useQuery<
    ClientReferenceDataResult,
    ClientReferenceDataVariables
  >(CLIENT_REFERENCE_DATA, { variables: { clientId } });

  const categoryNamesById = useMemo(
    () => buildNameLookup(data?.categories ?? []),
    [data?.categories],
  );
  const payeeNamesById = useMemo(
    () => buildNameLookup(data?.payees ?? []),
    [data?.payees],
  );

  return {
    accounts: data?.accounts ?? [],
    categoryNamesById,
    payeeNamesById,
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
