"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/transactions/categorized", label: "Categorized" },
  { href: "/transactions/uncategorized", label: "Uncategorized" },
];

// Tab links for switching between the transaction review views.
export function TransactionsNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 border-b border-gray-200 dark:border-gray-800">
      {TABS.map((tab) => {
        const isActive = pathname === tab.href;
        const tabClasses = isActive
          ? "border-blue-600 text-blue-700 dark:text-blue-300"
          : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200";

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${tabClasses}`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
