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
