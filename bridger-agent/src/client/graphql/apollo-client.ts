import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
          locations
        )}, Path: ${path?.toString()}`
      );
    });
  if (networkError) console.error(`[Network error]: ${networkError.message}`);
});

const links: ApolloLink[] = [errorLink];
links.push(createHttpLink({ uri: "/api/graphql" }));

export const apolloClient = new ApolloClient({
  link: ApolloLink.from(links),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          transactions: {
            // Cache one list per account + confidence filter; `first`/`after` are paging args, not list identity.
            keyArgs: ["accountId", "confidence"],
            // Append "load more" batches to the list we already have.
            merge(existing, incoming, { args }) {
              // No cursor means this is the first batch (initial load or refetch), so start over.
              if (!existing || !args?.after) {
                return incoming;
              }
              return {
                ...incoming,
                nodes: [...existing.nodes, ...incoming.nodes],
              };
            },
          },
        },
      },
    },
  }),
});
