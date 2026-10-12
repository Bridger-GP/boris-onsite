import { StatusMessage } from "@/components/StatusMessage/StatusMessage";

type PartnerStatusProps = {
  loading: boolean;
  errorMessage?: string;
};

// Shown in place of the paired transaction while it loads, or if it can't be loaded.
export function PartnerStatus({ loading, errorMessage }: PartnerStatusProps) {
  if (loading) {
    return <StatusMessage>Loading paired transaction…</StatusMessage>;
  }
  if (errorMessage) {
    return <StatusMessage tone="error">{errorMessage}</StatusMessage>;
  }
  return <StatusMessage tone="error">The paired transaction couldn&apos;t be found.</StatusMessage>;
}
