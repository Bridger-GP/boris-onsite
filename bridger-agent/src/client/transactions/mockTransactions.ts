import {
  TransactionState,
  type TransactionState as TransactionStateValue,
} from "@/server/modules/transactions/transactionState";
import type { TransactionRow } from "./types";

// Hardcoded mock data for the review UI. Replace with real GraphQL queries once the backend is ready.

type MockTemplate = {
  description: string;
  payeeName: string | null;
  categoryName: string | null;
  // Base amount in cents; the builder varies it slightly per row so rows aren't identical.
  amountCents: number;
};

const MOCK_TEMPLATES: MockTemplate[] = [
  { description: "AMAZON MKTPLACE PMTS", payeeName: "Amazon", categoryName: "Office Supplies", amountCents: -4599 },
  { description: "UBER *TRIP HELP.UBER.COM", payeeName: "Uber", categoryName: "Travel", amountCents: -2350 },
  { description: "STRIPE TRANSFER", payeeName: "Stripe", categoryName: "Sales Revenue", amountCents: 1250000 },
  { description: "GUSTO PAYROLL", payeeName: "Gusto", categoryName: "Payroll Expenses", amountCents: -2845000 },
  { description: "AWS EMEA AWS.AMAZON.CO", payeeName: "Amazon Web Services", categoryName: "Software & Hosting", amountCents: -189912 },
  { description: "WEWORK MEMBERSHIP", payeeName: "WeWork", categoryName: "Rent", amountCents: -450000 },
  { description: "PAYMENT THANK YOU - CHASE CARD", payeeName: null, categoryName: "Credit Card Payment", amountCents: -320000 },
  { description: "SLACK T0123ABC", payeeName: "Slack", categoryName: "Software & Hosting", amountCents: -8750 },
  { description: "BLUE BOTTLE COFFEE", payeeName: "Blue Bottle Coffee", categoryName: "Meals & Entertainment", amountCents: -1840 },
  { description: "DEPOSIT - CUSTOMER WIRE", payeeName: "Acme Corp", categoryName: "Sales Revenue", amountCents: 875000 },
  { description: "COMCAST BUSINESS", payeeName: "Comcast", categoryName: "Utilities", amountCents: -21999 },
  { description: "DELTA AIR LINES", payeeName: "Delta", categoryName: "Travel", amountCents: -64320 },
];

// Descriptions that look like raw, hard-to-categorize bank feed lines.
const UNCATEGORIZED_TEMPLATES: MockTemplate[] = [
  { description: "POS PURCHASE 4829 SQ *JOES", payeeName: null, categoryName: null, amountCents: -1275 },
  { description: "ACH DEBIT 0081923 PPD", payeeName: null, categoryName: null, amountCents: -55000 },
  { description: "ONLINE TRANSFER FROM CHK 4410", payeeName: null, categoryName: null, amountCents: 200000 },
  { description: "VENMO CASHOUT", payeeName: "Venmo", categoryName: null, amountCents: 34500 },
  { description: "CHECK #1042", payeeName: null, categoryName: null, amountCents: -120000 },
  { description: "PAYPAL *INST XFER", payeeName: "PayPal", categoryName: null, amountCents: -9900 },
  { description: "ZELLE TO J SMITH", payeeName: null, categoryName: null, amountCents: -30000 },
  { description: "MISC CREDIT ADJ", payeeName: null, categoryName: null, amountCents: 1500 },
];

const CATEGORIZED_STATES: TransactionStateValue[] = [
  TransactionState.READY_FOR_REVIEW,
  TransactionState.READY_FOR_REVIEW,
  TransactionState.REVIEWED,
  TransactionState.PROBLEM,
  TransactionState.READY_FOR_REVIEW,
  TransactionState.WRITTEN,
];

const UNCATEGORIZED_STATES: TransactionStateValue[] = [
  TransactionState.INGESTED,
  TransactionState.PROBLEM,
  TransactionState.INGESTED,
  TransactionState.IGNORED,
];

type BuildOptions = {
  count: number;
  idPrefix: string;
  templates: MockTemplate[];
  states: TransactionStateValue[];
};

// Deterministically builds `count` mock rows by cycling through templates and states.
// Dates count backwards one day per row from a fixed start date, so the list looks newest-first.
function buildMockTransactions(options: BuildOptions): TransactionRow[] {
  const startDate = Date.UTC(2026, 9, 10); // Oct 10, 2026
  const oneDayMs = 24 * 60 * 60 * 1000;
  const rows: TransactionRow[] = [];

  for (let index = 0; index < options.count; index++) {
    const template = options.templates[index % options.templates.length];
    const state = options.states[index % options.states.length];

    // Nudge the amount per row (same sign as the template) so repeated templates differ.
    const variationCents = (index * 137) % 1000;
    const amountCents =
      template.amountCents < 0
        ? template.amountCents - variationCents
        : template.amountCents + variationCents;

    rows.push({
      id: `${options.idPrefix}-${index + 1}`,
      externalId: `EXT-${options.idPrefix.toUpperCase()}-${String(100000 + index * 7919).slice(-6)}`,
      date: new Date(startDate - index * oneDayMs).toISOString(),
      amountCents,
      description: template.description,
      state,
      categoryName: template.categoryName,
      payeeName: template.payeeName,
      // Roughly every fifth row is paired with another transaction.
      isPaired: index % 5 === 2,
    });
  }

  return rows;
}

export const MOCK_CATEGORIZED_TRANSACTIONS: TransactionRow[] = buildMockTransactions({
  count: 62,
  idPrefix: "cat",
  templates: MOCK_TEMPLATES,
  states: CATEGORIZED_STATES,
});

export const MOCK_UNCATEGORIZED_TRANSACTIONS: TransactionRow[] = buildMockTransactions({
  count: 31,
  idPrefix: "unc",
  templates: UNCATEGORIZED_TEMPLATES,
  states: UNCATEGORIZED_STATES,
});
