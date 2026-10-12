// Returns the client ID the review UI is scoped to, or null if NEXT_PUBLIC_CLIENT_ID isn't set.
// See .env.example. Next.js inlines NEXT_PUBLIC_* vars at build time, so restart the dev server after changing it.
export function getClientId(): string | null {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  if (!clientId) {
    return null;
  }
  return clientId;
}
