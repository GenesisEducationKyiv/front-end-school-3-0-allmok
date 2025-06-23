import { create } from 'zustand';

interface SelectionState {
  selectedIds: Set<string>;
  toggleId: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedIds: new Set(),
  toggleId: (id) => set((state) => {
    const newSelectedIds = new Set(state.selectedIds);
    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id);
    } else {
      newSelectedIds.add(id);
    }
    return { selectedIds: newSelectedIds };
  }),
  selectAll: (ids) => set({ selectedIds: new Set(ids) }),
  clearSelection: () => set({ selectedIds: new Set() }),
}));