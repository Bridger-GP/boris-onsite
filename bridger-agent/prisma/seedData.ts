// Static reference data and transaction templates used by prisma/seed.ts.
// All amounts are signed cents: negative = money leaving the account.

export type AccountKey = "operating" | "payroll" | "savings" | "amex" | "ink";

export const CLIENT_NAME = "Acme Design Studio";

export const ACCOUNT_NAMES: Record<AccountKey, string> = {
  operating: "Chase Operating Checking ••4821",
  payroll: "Chase Payroll Checking ••7713",
  savings: "Chase Business Savings ••9930",
  amex: "Amex Business Gold ••1005",
  ink: "Chase Ink Business Cash ••3367",
};

export const CATEGORY_NAMES = [
  "Sales Revenue",
  "Interest Income",
  "Rent",
  "Payroll Wages",
  "Payroll Taxes",
  "Payroll Processing Fees",
  "Utilities",
  "Internet & Phone",
  "Insurance",
  "Software & Subscriptions",
  "Cloud Hosting",
  "Travel - Airfare",
  "Travel - Lodging",
  "Travel - Ground Transport",
  "Meals",
  "Office Supplies",
  "Computer Equipment",
  "Fuel",
  "Advertising & Marketing",
] as const;

export type CategoryName = (typeof CATEGORY_NAMES)[number];

export type PayeeSeed = {
  name: string;
  reviewed: boolean;
};

export const PAYEES: PayeeSeed[] = [
  { name: "Stripe", reviewed: true },
  { name: "Northwind Traders", reviewed: true },
  { name: "Contoso Ltd", reviewed: true },
  { name: "Chase", reviewed: true },
  { name: "WeWork", reviewed: true },
  { name: "Gusto", reviewed: true },
  { name: "Comcast Business", reviewed: true },
  { name: "PG&E", reviewed: true },
  { name: "The Hartford", reviewed: true },
  { name: "Amazon Web Services", reviewed: true },
  { name: "Google Workspace", reviewed: true },
  { name: "Slack", reviewed: true },
  { name: "Figma", reviewed: true },
  { name: "Adobe", reviewed: true },
  { name: "Delta Air Lines", reviewed: true },
  { name: "Uber", reviewed: true },
  { name: "Marriott", reviewed: true },
  { name: "DoorDash", reviewed: false },
  { name: "Amazon", reviewed: true },
  { name: "Staples", reviewed: true },
  { name: "Starbucks", reviewed: false },
  { name: "Shell", reviewed: true },
  { name: "Zoom", reviewed: true },
  { name: "LinkedIn", reviewed: false },
  { name: "J Martinez", reviewed: false },
];

// A vendor or customer that shows up on a regular cadence and categorizes cleanly.
// Seeded as READY_FOR_REVIEW.
export type RecurringTemplate = {
  account: AccountKey;
  description: string;
  payee: string;
  category: CategoryName;
  perMonth: number;
  minCents: number;
  maxCents: number;
  // When set, roughly a third of these are seeded as splits across these categories.
  splitCategories?: [CategoryName, CategoryName];
};

export const RECURRING_TEMPLATES: RecurringTemplate[] = [
  // Operating checking
  { account: "operating", description: "STRIPE TRANSFER ST-{ref}", payee: "Stripe", category: "Sales Revenue", perMonth: 4, minCents: 80_000, maxCents: 450_000 },
  { account: "operating", description: "ACH DEPOSIT NORTHWIND TRADERS", payee: "Northwind Traders", category: "Sales Revenue", perMonth: 1, minCents: 500_000, maxCents: 1_200_000 },
  { account: "operating", description: "ACH DEPOSIT CONTOSO LTD INV {ref}", payee: "Contoso Ltd", category: "Sales Revenue", perMonth: 1, minCents: 300_000, maxCents: 900_000 },
  { account: "operating", description: "WEWORK MEMBERSHIP", payee: "WeWork", category: "Rent", perMonth: 1, minCents: -650_000, maxCents: -650_000 },
  { account: "operating", description: "GUSTO FEE {ref}", payee: "Gusto", category: "Payroll Processing Fees", perMonth: 1, minCents: -14_900, maxCents: -18_500 },
  { account: "operating", description: "COMCAST BUSINESS 8155", payee: "Comcast Business", category: "Internet & Phone", perMonth: 1, minCents: -18_999, maxCents: -18_999 },
  { account: "operating", description: "PGANDE WEB ONLINE", payee: "PG&E", category: "Utilities", perMonth: 1, minCents: -21_000, maxCents: -38_000 },
  { account: "operating", description: "THE HARTFORD INS PREM", payee: "The Hartford", category: "Insurance", perMonth: 1, minCents: -42_000, maxCents: -42_000 },

  // Payroll checking
  { account: "payroll", description: "GUSTO NET {ref}", payee: "Gusto", category: "Payroll Wages", perMonth: 2, minCents: -2_600_000, maxCents: -2_400_000 },
  { account: "payroll", description: "GUSTO TAX {ref}", payee: "Gusto", category: "Payroll Taxes", perMonth: 2, minCents: -700_000, maxCents: -600_000 },

  // Savings
  { account: "savings", description: "INTEREST PAYMENT", payee: "Chase", category: "Interest Income", perMonth: 1, minCents: 1_200, maxCents: 4_800 },

  // Amex
  { account: "amex", description: "AMAZON WEB SERVICES AWS.AMAZON.CO", payee: "Amazon Web Services", category: "Cloud Hosting", perMonth: 1, minCents: -60_000, maxCents: -30_000 },
  { account: "amex", description: "GOOGLE *WORKSPACE ACMEDESIGN", payee: "Google Workspace", category: "Software & Subscriptions", perMonth: 1, minCents: -14_400, maxCents: -14_400 },
  { account: "amex", description: "SLACK T0{ref}", payee: "Slack", category: "Software & Subscriptions", perMonth: 1, minCents: -8_750, maxCents: -8_750 },
  { account: "amex", description: "FIGMA MONTHLY", payee: "Figma", category: "Software & Subscriptions", perMonth: 1, minCents: -7_500, maxCents: -7_500 },
  { account: "amex", description: "ADOBE *CREATIVE CLOUD", payee: "Adobe", category: "Software & Subscriptions", perMonth: 1, minCents: -8_999, maxCents: -8_999 },
  { account: "amex", description: "DELTA AIR LINES 006{ref}", payee: "Delta Air Lines", category: "Travel - Airfare", perMonth: 2, minCents: -90_000, maxCents: -30_000 },
  { account: "amex", description: "UBER *TRIP", payee: "Uber", category: "Travel - Ground Transport", perMonth: 5, minCents: -6_000, maxCents: -1_500 },
  { account: "amex", description: "MARRIOTT {ref} NEW YORK NY", payee: "Marriott", category: "Travel - Lodging", perMonth: 1, minCents: -60_000, maxCents: -25_000 },
  { account: "amex", description: "DOORDASH*{ref}", payee: "DoorDash", category: "Meals", perMonth: 3, minCents: -9_000, maxCents: -2_500 },

  // Chase Ink
  { account: "ink", description: "AMAZON.COM*{ref} AMZN.COM/BILL", payee: "Amazon", category: "Office Supplies", perMonth: 5, minCents: -30_000, maxCents: -2_000, splitCategories: ["Office Supplies", "Computer Equipment"] },
  { account: "ink", description: "STAPLES {ref}", payee: "Staples", category: "Office Supplies", perMonth: 2, minCents: -12_000, maxCents: -1_500 },
  { account: "ink", description: "STARBUCKS STORE {ref}", payee: "Starbucks", category: "Meals", perMonth: 4, minCents: -2_500, maxCents: -500 },
  { account: "ink", description: "SHELL OIL {ref}", payee: "Shell", category: "Fuel", perMonth: 2, minCents: -8_000, maxCents: -4_000 },
  { account: "ink", description: "ZOOM.US 888-799-9666", payee: "Zoom", category: "Software & Subscriptions", perMonth: 1, minCents: -1_499, maxCents: -1_499 },
  { account: "ink", description: "LINKEDIN *ADS {ref}", payee: "LinkedIn", category: "Advertising & Marketing", perMonth: 1, minCents: -50_000, maxCents: -20_000 },
];

// A money movement between two of the client's own accounts. Seeded as a paired
// transaction (one row per account) in READY_FOR_REVIEW.
export type TransferTemplate = {
  from: AccountKey;
  to: AccountKey;
  fromDescription: string;
  toDescription: string;
  perMonth: number;
  // Positive cents; the "from" side is recorded as the negative of this.
  minCents: number;
  maxCents: number;
};

export const TRANSFER_TEMPLATES: TransferTemplate[] = [
  { from: "operating", to: "amex", fromDescription: "AMEX EPAYMENT ACH PMT", toDescription: "PAYMENT RECEIVED - THANK YOU", perMonth: 1, minCents: 300_000, maxCents: 900_000 },
  { from: "operating", to: "ink", fromDescription: "CHASE CREDIT CRD AUTOPAY", toDescription: "AUTOMATIC PAYMENT - THANK YOU", perMonth: 1, minCents: 150_000, maxCents: 500_000 },
  { from: "operating", to: "payroll", fromDescription: "ONLINE TRANSFER TO CHK ••7713", toDescription: "ONLINE TRANSFER FROM CHK ••4821", perMonth: 2, minCents: 3_000_000, maxCents: 3_400_000 },
  { from: "operating", to: "savings", fromDescription: "ONLINE TRANSFER TO SAV ••9930", toDescription: "ONLINE TRANSFER FROM CHK ••4821", perMonth: 1, minCents: 500_000, maxCents: 1_500_000 },
];

// A transaction the categorizer couldn't handle confidently. Seeded as PROBLEM.
export type ProblemTemplate = {
  account: AccountKey;
  description: string;
  payee: string | null;
  suggestedCategory: CategoryName | null;
  needsClientFeedback: boolean;
  // Total number to create across the whole seed period (not per month).
  count: number;
  minCents: number;
  maxCents: number;
};

export const PROBLEM_TEMPLATES: ProblemTemplate[] = [
  { account: "operating", description: "ZELLE PAYMENT TO J MARTINEZ {ref}", payee: "J Martinez", suggestedCategory: null, needsClientFeedback: true, count: 4, minCents: -120_000, maxCents: -15_000 },
  { account: "operating", description: "CHECK #{ref}", payee: null, suggestedCategory: null, needsClientFeedback: true, count: 4, minCents: -250_000, maxCents: -5_000 },
  { account: "operating", description: "WIRE OUT REF {ref}", payee: null, suggestedCategory: null, needsClientFeedback: true, count: 2, minCents: -1_500_000, maxCents: -500_000 },
  { account: "operating", description: "ATM WITHDRAWAL {ref} SAN FRANCISCO CA", payee: null, suggestedCategory: null, needsClientFeedback: true, count: 2, minCents: -40_000, maxCents: -20_000 },
  { account: "operating", description: "BRANCH DEPOSIT", payee: null, suggestedCategory: "Sales Revenue", needsClientFeedback: true, count: 3, minCents: 50_000, maxCents: 300_000 },
  { account: "amex", description: "PAYPAL *INST XFER {ref}", payee: null, suggestedCategory: null, needsClientFeedback: false, count: 3, minCents: -40_000, maxCents: -2_000 },
  { account: "amex", description: "AMZN MKTP US*{ref}", payee: "Amazon", suggestedCategory: "Office Supplies", needsClientFeedback: true, count: 3, minCents: -25_000, maxCents: -1_500 },
  { account: "amex", description: "CREDIT ADJUSTMENT ADOBE", payee: "Adobe", suggestedCategory: "Software & Subscriptions", needsClientFeedback: false, count: 1, minCents: 8_999, maxCents: 8_999 },
  { account: "ink", description: "SQ *{ref} SAN FRANCISCO CA", payee: null, suggestedCategory: "Meals", needsClientFeedback: false, count: 4, minCents: -6_000, maxCents: -800 },
  { account: "ink", description: "VENMO *{ref}", payee: null, suggestedCategory: null, needsClientFeedback: true, count: 2, minCents: -20_000, maxCents: -2_000 },
  { account: "payroll", description: "GUSTO NET ADJ {ref}", payee: "Gusto", suggestedCategory: "Payroll Wages", needsClientFeedback: false, count: 1, minCents: -150_000, maxCents: -50_000 },
  { account: "savings", description: "TRANSFER FROM ••5521", payee: null, suggestedCategory: null, needsClientFeedback: true, count: 1, minCents: 100_000, maxCents: 500_000 },
];
