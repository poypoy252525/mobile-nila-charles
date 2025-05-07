import { create } from "zustand";

interface Store {
  student:
    | {
        email: string;
        status: string;
        studentId: string;
      }
    | undefined;

  setStudent: (student: {
    email: string;
    status: string;
    studentId: string;
  }) => void;
}

export const useUserStore = create<Store>((set) => ({
  student: undefined,
  setStudent: (student) => set({ student }),
}));
