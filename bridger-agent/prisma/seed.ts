// Seeds the database with one client, five bank accounts and ~200 transactions,
// all in READY_FOR_REVIEW or PROBLEM. Wipes existing data first.
// Run with: npm run prisma:seed
import { PrismaClient } from "@prisma/client";
import { TransactionState } from "../src/server/modules/transactions/transactionState";
import {
  ACCOUNT_NAMES,
  AccountKey,
  CATEGORY_NAMES,
  CLIENT_NAME,
  PAYEES,
  PROBLEM_TEMPLATES,
  ProblemTemplate,
  RECURRING_TEMPLATES,
  RecurringTemplate,
  TRANSFER_TEMPLATES,
  TransferTemplate,
} from "./seedData";

const prisma = new PrismaClient();

// The seed covers July–September 2026 (JS months are 0-indexed).
const SEED_YEAR = 2026;
const SEED_MONTHS = [6, 7, 8];

// Fraction of recurring transactions marked as high confidence.
const HIGH_CONFIDENCE_RATE = 0.85;
// Fraction of split-eligible recurring transactions seeded as splits.
const SPLIT_RATE = 1 / 3;

// IDs of the rows created by createReferenceData, keyed by their seed names.
type SeedContext = {
  accountIds: Record<AccountKey, string>;
  categoryIds: Map<string, string>;
  payeeIds: Map<string, string>;
};

// --- Deterministic randomness -------------------------------------------------

// Mulberry32 PRNG with a fixed seed, so every run produces identical data.
function createRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = createRandom(42);

// Returns an integer in [min, max], inclusive. Works for negative ranges too.
function randomInt(min: number, max: number): number {
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  return low + Math.floor(random() * (high - low + 1));
}

// Returns a random calendar date in the given month, stored as midnight UTC.
function randomDateInMonth(month: number): Date {
  const day = randomInt(1, 28);
  return new Date(Date.UTC(SEED_YEAR, month, day));
}

// Returns a random calendar date anywhere in the seed period.
function randomDateInSeedPeriod(): Date {
  const month = SEED_MONTHS[randomInt(0, SEED_MONTHS.length - 1)];
  return randomDateInMonth(month);
}

// Replaces a "{ref}" placeholder with a random 4-digit reference number.
function fillReference(description: string): string {
  return description.replace("{ref}", String(randomInt(1000, 9999)));
}

// --- Helpers ------------------------------------------------------------------

// Looks up a seeded ID by name, failing loudly on typos in seedData.ts.
function lookupId(ids: Map<string, string>, name: string, kind: string): string {
  const id = ids.get(name);
  if (id === undefined) {
    throw new Error(`Seed data references unknown ${kind}: "${name}"`);
  }
  return id;
}

// Hands out sequential, per-account IDs that stand in for the bank feed's IDs.
const externalIdCounters = new Map<AccountKey, number>();

function nextExternalId(account: AccountKey): string {
  const next = (externalIdCounters.get(account) ?? 0) + 1;
  externalIdCounters.set(account, next);
  return `feed-${account}-${String(next).padStart(5, "0")}`;
}

// --- Seed steps ---------------------------------------------------------------

// Deletes all clients; the schema's cascades remove everything else with them.
async function resetDatabase(): Promise<void> {
  await prisma.client.deleteMany();
}

// Creates the client plus its accounts, categories and payees, and returns their IDs.
async function createReferenceData(): Promise<SeedContext> {
  const client = await prisma.client.create({ data: { name: CLIENT_NAME } });

  const accountIds = {} as Record<AccountKey, string>;
  for (const [key, name] of Object.entries(ACCOUNT_NAMES)) {
    const account = await prisma.account.create({
      data: { clientId: client.id, name },
    });
    accountIds[key as AccountKey] = account.id;
  }

  const categoryIds = new Map<string, string>();
  for (const name of CATEGORY_NAMES) {
    const category = await prisma.category.create({
      data: { clientId: client.id, name },
    });
    categoryIds.set(name, category.id);
  }

  const payeeIds = new Map<string, string>();
  for (const payee of PAYEES) {
    const created = await prisma.payee.create({
      data: { clientId: client.id, name: payee.name, reviewed: payee.reviewed },
    });
    payeeIds.set(payee.name, created.id);
  }

  return { accountIds, categoryIds, payeeIds };
}

// Creates one READY_FOR_REVIEW transaction from a recurring template.
// Split-eligible templates are sometimes seeded as a two-way split instead of a
// single category; in that case the parent transaction has no category itself.
async function createRecurringTransaction(
  context: SeedContext,
  template: RecurringTemplate,
  month: number,
): Promise<void> {
  const amountCents = randomInt(template.minCents, template.maxCents);
  const payeeId = lookupId(context.payeeIds, template.payee, "payee");
  const shouldSplit =
    template.splitCategories !== undefined && random() < SPLIT_RATE;

  const baseData = {
    accountId: context.accountIds[template.account],
    externalId: nextExternalId(template.account),
    amountCents,
    date: randomDateInMonth(month),
    description: fillReference(template.description),
    state: TransactionState.READY_FOR_REVIEW,
    payeeId,
    isHighConfidence: random() < HIGH_CONFIDENCE_RATE,
  };

  if (!shouldSplit || template.splitCategories === undefined) {
    await prisma.transaction.create({
      data: {
        ...baseData,
        categoryId: lookupId(context.categoryIds, template.category, "category"),
      },
    });
    return;
  }

  // Split 40–70% into the first category and the exact remainder into the second,
  // so the split amounts always sum to the parent amount.
  const [firstCategory, secondCategory] = template.splitCategories;
  const firstAmountCents = Math.round(amountCents * (0.4 + random() * 0.3));
  const secondAmountCents = amountCents - firstAmountCents;

  await prisma.transaction.create({
    data: {
      ...baseData,
      splits: {
        create: [
          {
            categoryId: lookupId(context.categoryIds, firstCategory, "category"),
            payeeId,
            amountCents: firstAmountCents,
          },
          {
            categoryId: lookupId(context.categoryIds, secondCategory, "category"),
            payeeId,
            amountCents: secondAmountCents,
          },
        ],
      },
    },
  });
}

// Creates both sides of a transfer between two of the client's accounts and links
// them to each other via pairTransactionId.
async function createTransferPair(
  context: SeedContext,
  template: TransferTemplate,
  month: number,
): Promise<void> {
  const amountCents = randomInt(template.minCents, template.maxCents);
  const date = randomDateInMonth(month);

  await prisma.$transaction(async (tx) => {
    const fromSide = await tx.transaction.create({
      data: {
        accountId: context.accountIds[template.from],
        externalId: nextExternalId(template.from),
        amountCents: -amountCents,
        date,
        description: template.fromDescription,
        state: TransactionState.READY_FOR_REVIEW,
        isHighConfidence: true,
      },
    });

    const toSide = await tx.transaction.create({
      data: {
        accountId: context.accountIds[template.to],
        externalId: nextExternalId(template.to),
        amountCents,
        date,
        description: template.toDescription,
        state: TransactionState.READY_FOR_REVIEW,
        isHighConfidence: true,
        pairTransactionId: fromSide.id,
      },
    });

    await tx.transaction.update({
      where: { id: fromSide.id },
      data: { pairTransactionId: toSide.id },
    });
  });
}

// Creates one PROBLEM transaction: low confidence, often missing a payee or
// category, and sometimes flagged as needing input from the client.
async function createProblemTransaction(
  context: SeedContext,
  template: ProblemTemplate,
): Promise<void> {
  let payeeId: string | null = null;
  if (template.payee !== null) {
    payeeId = lookupId(context.payeeIds, template.payee, "payee");
  }

  let categoryId: string | null = null;
  if (template.suggestedCategory !== null) {
    categoryId = lookupId(context.categoryIds, template.suggestedCategory, "category");
  }

  await prisma.transaction.create({
    data: {
      accountId: context.accountIds[template.account],
      externalId: nextExternalId(template.account),
      amountCents: randomInt(template.minCents, template.maxCents),
      date: randomDateInSeedPeriod(),
      description: fillReference(template.description),
      state: TransactionState.PROBLEM,
      payeeId,
      categoryId,
      isHighConfidence: false,
      needsClientFeedback: template.needsClientFeedback,
    },
  });
}

// Prints row counts so it's easy to confirm the seed did what we expect.
async function printSummary(): Promise<void> {
  const transactionsByState = await prisma.transaction.groupBy({
    by: ["state"],
    _count: true,
  });

  console.log("Seeded:");
  console.log(`  clients:      ${await prisma.client.count()}`);
  console.log(`  accounts:     ${await prisma.account.count()}`);
  console.log(`  categories:   ${await prisma.category.count()}`);
  console.log(`  payees:       ${await prisma.payee.count()}`);
  console.log(`  transactions: ${await prisma.transaction.count()}`);
  for (const group of transactionsByState) {
    console.log(`    ${group.state}: ${group._count}`);
  }
  console.log(`  splits:       ${await prisma.splitTransaction.count()}`);
}

async function main(): Promise<void> {
  await resetDatabase();
  const context = await createReferenceData();

  for (const month of SEED_MONTHS) {
    for (const template of RECURRING_TEMPLATES) {
      for (let i = 0; i < template.perMonth; i++) {
        await createRecurringTransaction(context, template, month);
      }
    }

    for (const template of TRANSFER_TEMPLATES) {
      for (let i = 0; i < template.perMonth; i++) {
        await createTransferPair(context, template, month);
      }
    }
  }

  for (const template of PROBLEM_TEMPLATES) {
    for (let i = 0; i < template.count; i++) {
      await createProblemTransaction(context, template);
    }
  }

  await printSummary();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
