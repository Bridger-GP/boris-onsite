import { prisma } from "@/lib/db";
import { WriteErrorCode, writeError } from "@/server/graphql/errors";

// Fields returned for a payee, matching the GraphQL `Payee` type.
const PAYEE_FIELDS = { id: true, name: true, reviewed: true } as const;

type CreatePayeeArgs = {
  clientId: string;
  name: string;
};

// Creates a new, unreviewed payee for a client. The name is trimmed, must not be
// blank, and must not match an existing payee for that client.
export const createPayee = async (_parent: unknown, args: CreatePayeeArgs) => {
  const name = args.name.trim();
  if (name === "") {
    throw writeError(WriteErrorCode.INVALID_INPUT, "Payee name cannot be blank");
  }

  const client = await prisma.client.findUnique({ where: { id: args.clientId } });
  if (client === null) {
    throw writeError(WriteErrorCode.NOT_FOUND, `Client ${args.clientId} not found`);
  }

  const existing = await prisma.payee.findUnique({
    where: { clientId_name: { clientId: args.clientId, name } },
  });
  if (existing !== null) {
    throw writeError(
      WriteErrorCode.INVALID_INPUT,
      `A payee named "${name}" already exists for this client`,
    );
  }

  return prisma.payee.create({
    data: { clientId: args.clientId, name },
    select: PAYEE_FIELDS,
  });
};

type ReviewPayeeArgs = {
  payeeId: string;
};

// Marks a payee as reviewed. Reviewing an already-reviewed payee is a no-op.
export const reviewPayee = async (_parent: unknown, args: ReviewPayeeArgs) => {
  const payee = await prisma.payee.findUnique({ where: { id: args.payeeId } });
  if (payee === null) {
    throw writeError(WriteErrorCode.NOT_FOUND, `Payee ${args.payeeId} not found`);
  }

  return prisma.payee.update({
    where: { id: args.payeeId },
    data: { reviewed: true },
    select: PAYEE_FIELDS,
  });
};
