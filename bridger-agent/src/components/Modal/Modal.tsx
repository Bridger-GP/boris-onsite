import { useEffect, type ReactNode } from "react";

type ModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
  // Buttons rendered right-aligned at the bottom of the dialog.
  footer?: ReactNode;
};

// Generic modal shell: dimmed backdrop, centered panel, closes on Escape or backdrop click.
export function Modal({ title, onClose, children, footer }: ModalProps) {
  // Close on Escape while the modal is mounted.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-lg rounded-lg bg-white shadow-xl dark:bg-gray-900"
        // Stop clicks inside the panel from reaching the backdrop's close handler.
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="border-b border-gray-200 px-5 py-3 text-lg font-semibold dark:border-gray-800">
          {title}
        </h2>
        <div className="px-5 py-4 text-sm">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-3 dark:border-gray-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
