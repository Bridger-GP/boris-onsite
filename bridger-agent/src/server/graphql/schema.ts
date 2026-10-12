import { accounts } from "@/server/modules/accounts/api";
import { categories } from "@/server/modules/categories/api";
import { greetings } from "@/server/modules/greet/api";
import { payees } from "@/server/modules/payees/api";
import { transactions } from "@/server/modules/transactions/api";
import { createSchema } from "graphql-yoga";
import { typeDefs } from "./typeDefs";

// The executable GraphQL schema: type definitions wired to their resolvers.
export const schema = createSchema({
  typeDefs,
  resolvers: {
    Query: {
      greetings,
      accounts,
      categories,
      payees,
      transactions,
    },
  },
});
