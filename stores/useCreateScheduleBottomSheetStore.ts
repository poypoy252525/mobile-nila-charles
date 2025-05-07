import BottomSheet from "@gorhom/bottom-sheet";
import { RefObject } from "react";
import { create } from "zustand";

interface Store {
  ref: RefObject<BottomSheet> | undefined;
  setRef: (ref: RefObject<BottomSheet>) => void;
}

export const useCreateScheduleBottomSheetStore = create<Store>((set) => ({
  ref: undefined,
  setRef: (ref) => set({ ref }),
}));
