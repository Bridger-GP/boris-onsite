type OptionalTextProps = {
  value: string | null;
};

// Renders the value, or a muted dash when it's missing.
export function OptionalText({ value }: OptionalTextProps) {
  if (value === null) {
    return <span className="text-gray-400">—</span>;
  }
  return <>{value}</>;
}
