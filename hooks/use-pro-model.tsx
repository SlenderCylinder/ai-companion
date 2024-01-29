import { create } from "zustand";

interface userProModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onclose: () => void;
};

export const userProModal = create<userProModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onclose: () => set({ isOpen: false}),
}))