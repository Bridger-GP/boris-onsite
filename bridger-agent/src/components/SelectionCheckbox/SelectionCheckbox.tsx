import { useEffect, useRef } from "react";

type SelectionCheckboxProps = {
  checked: boolean;
  // Shows the "–" state (some but not all selected). Only meaningful when `checked` is false.
  indeterminate?: boolean;
  onChange: () => void;
  ariaLabel: string;
};

// Checkbox used for row selection and the "select all on page" header.
// `indeterminate` can only be set via the DOM property (there is no HTML attribute), so we sync it with a ref.
export function SelectionCheckbox({
  checked,
  indeterminate = false,
  onChange,
  ariaLabel,
}: SelectionCheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate && !checked;
    }
  }, [indeterminate, checked]);

  return (
    <input
      ref={inputRef}
      type="checkbox"
      className="h-4 w-4 cursor-pointer accent-blue-600"
      checked={checked}
      onChange={onChange}
      aria-label={ariaLabel}
    />
  );
}
