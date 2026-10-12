import { accounts } from "@/server/modules/accounts/api";
import { categories } from "@/server/modules/categories/api";
import { greetings } from "@/server/modules/greet/api";
import { payees } from "@/server/modules/payees/api";
import { createPayee, reviewPayee } from "@/server/modules/payees/mutations";
import { transaction, transactions } from "@/server/modules/transactions/api";
import {
  bulkApproveTransactions,
  pairTransactions,
  splitTransaction,
  submitTransaction,
  unpairTransactions,
  unsplitTransaction,
} from "@/server/modules/transactions/mutations";
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
      transaction,
    },
    Mutation: {
      bulkApproveTransactions,
      submitTransaction,
      pairTransactions,
      unpairTransactions,
      splitTransaction,
      unsplitTransaction,
      createPayee,
      reviewPayee,
    },
  },
});
