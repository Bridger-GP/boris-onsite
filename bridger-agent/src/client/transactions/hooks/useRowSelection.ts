import { useCallback, useState } from "react";

export type RowSelection = {
  selectedIds: Set<string>;
  isSelected: (id: string) => boolean;
  toggle: (id: string) => void;
  // Selects all of `ids` if any are unselected; otherwise deselects all of them.
  toggleMany: (ids: string[]) => void;
  clear: () => void;
};

// Tracks a set of selected row IDs. Keyed by ID, so the selection survives paging.
export function useRowSelection(): RowSelection {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds],
  );

  const toggle = useCallback((id: string) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleMany = useCallback((ids: string[]) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      const allAlreadySelected = ids.every((id) => previous.has(id));
      for (const id of ids) {
        if (allAlreadySelected) {
          next.delete(id);
        } else {
          next.add(id);
        }
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => setSelectedIds(new Set()), []);

  return { selectedIds, isSelected, toggle, toggleMany, clear };
}
