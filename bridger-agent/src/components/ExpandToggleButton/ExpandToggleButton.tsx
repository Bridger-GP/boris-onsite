type ExpandToggleButtonProps = {
  isExpanded: boolean;
  onToggle: () => void;
  // Describes what expanding shows, e.g. "split details".
  label: string;
};

// Small chevron button that shows or hides a row's details sub-row.
export function ExpandToggleButton({ isExpanded, onToggle, label }: ExpandToggleButtonProps) {
  const action = isExpanded ? "Hide" : "Show";
  const rotation = isExpanded ? "rotate-180" : "";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isExpanded}
      aria-label={`${action} ${label}`}
      title={`${action} ${label}`}
      className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
    >
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className={`h-4 w-4 transition-transform ${rotation}`}>
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}
