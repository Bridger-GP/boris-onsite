import type { ReactNode } from "react";

type StatusMessageProps = {
  children: ReactNode;
  tone?: "neutral" | "error";
};

const TONE_CLASSES = {
  neutral: "border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400",
  error: "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200",
};

// Boxed message for loading, empty and error states.
export function StatusMessage({ children, tone = "neutral" }: StatusMessageProps) {
  return (
    <div className={`rounded-lg border px-4 py-6 text-center text-sm ${TONE_CLASSES[tone]}`}>
      {children}
    </div>
  );
}
