"use client";

import { ApolloProvider } from "@apollo/client";
import type { ReactNode } from "react";
import { apolloClient } from "./apollo-client";

type ApolloClientProviderProps = {
  children: ReactNode;
};

// Makes the shared Apollo client available to client components below it.
export function ApolloClientProvider({ children }: ApolloClientProviderProps) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
