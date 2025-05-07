import { create } from "zustand";

interface Store {
  token: string;
  setToken: (token: string) => void;
}

export const useExpoPushToken = create<Store>((set) => ({
  token: "",
  setToken: (token) => set({ token }),
}));
