import { prisma } from "@/lib/db";

type CategoriesArgs = {
  clientId: string;
};

// Returns all categories belonging to a client, sorted by name.
export const categories = async (_parent: unknown, args: CategoriesArgs) => {
  return prisma.category.findMany({
    where: { clientId: args.clientId },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
};
