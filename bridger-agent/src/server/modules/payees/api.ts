import { prisma } from "@/lib/db";

type PayeesArgs = {
  clientId: string;
};

// Returns all payees belonging to a client, sorted by name.
export const payees = async (_parent: unknown, args: PayeesArgs) => {
  return prisma.payee.findMany({
    where: { clientId: args.clientId },
    select: { id: true, name: true, reviewed: true },
    orderBy: { name: "asc" },
  });
};
