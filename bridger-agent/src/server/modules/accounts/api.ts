import { prisma } from "@/lib/db";

type AccountsArgs = {
  clientId: string;
};

// Returns all bank accounts belonging to a client, sorted by name.
export const accounts = async (_parent: unknown, args: AccountsArgs) => {
  return prisma.account.findMany({
    where: { clientId: args.clientId },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
};
