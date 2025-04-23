import { create } from 'zustand';

interface MenuSidebarState {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

export const useMenuSidebar = create<MenuSidebarState>((set) => ({
  isOpen: true, // Mặc định sidebar mở
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
})); 