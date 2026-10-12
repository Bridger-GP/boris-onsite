const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  // Dates are stored as midnight UTC; format in UTC so they don't shift a day in other timezones.
  timeZone: "UTC",
});

// Formats a signed cent amount as USD, e.g. -123456 -> "-$1,234.56".
export function formatAmount(amountCents: number): string {
  return usdFormatter.format(amountCents / 100);
}

// Formats an ISO date string as a short calendar date, e.g. "Sep 14, 2026".
export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}

// Formats an unsigned cent amount as a plain dollar string for an input field, e.g. 123456 -> "1234.56".
export function centsToDollarInput(amountCents: number): string {
  return (Math.abs(amountCents) / 100).toFixed(2);
}

// Parses a user-typed dollar amount ("12", "12.3", "1,234.56", "$5") into whole cents.
// Returns null if it isn't a valid non-negative amount with at most two decimal places.
export function parseDollarInput(input: string): number | null {
  const cleaned = input.replace(/[$,\s]/g, "");
  if (!/^\d+(\.\d{0,2})?$/.test(cleaned)) {
    return null;
  }
  return Math.round(Number(cleaned) * 100);
}
