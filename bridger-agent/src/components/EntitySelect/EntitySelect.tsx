import type { NamedEntity } from "@/client/transactions/apiTypes";

type EntitySelectProps = {
  label: string;
  options: NamedEntity[];
  // null shows the placeholder.
  value: string | null;
  // Shown when nothing is selected.
  placeholder: string;
  // null when the placeholder is chosen (only possible with `allowEmpty`).
  onChange: (id: string | null) => void;
  // Lets the user go back to "nothing selected". Off by default, because the submit API can
  // only set (not clear) a transaction's category or payee.
  allowEmpty?: boolean;
  // Keeps the label for screen readers only, e.g. inside a table cell under a column header.
  hideLabel?: boolean;
  disabled?: boolean;
};

// Labeled dropdown for picking one entity (category, payee, ...) by ID.
export function EntitySelect({
  label,
  options,
  value,
  placeholder,
  onChange,
  allowEmpty = false,
  hideLabel = false,
  disabled = false,
}: EntitySelectProps) {
  function handleChange(selectedValue: string) {
    if (selectedValue === "") {
      onChange(null);
    } else {
      onChange(selectedValue);
    }
  }

  const labelClasses = hideLabel ? "sr-only" : "font-medium text-gray-700 dark:text-gray-300";

  return (
    <label className="flex flex-col gap-1">
      <span className={labelClasses}>{label}</span>
      <select
        className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-900 dark:disabled:bg-gray-800"
        value={value ?? ""}
        onChange={(event) => handleChange(event.target.value)}
        disabled={disabled}
      >
        <option value="" disabled={!allowEmpty}>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </label>
  );
}
