import { useCreateScheduleBottomSheetStore } from "@/stores/useCreateScheduleBottomSheetStore";
import BottomSheet from "@gorhom/bottom-sheet";
import React, { useEffect, useMemo, useRef } from "react";
import { StyleSheet } from "react-native";
import BottomSheetContent from "./BottomSheetContent";

const CreateScheduleBottomSheet = () => {
  const ref = useRef<BottomSheet>(null);
  const setRef = useCreateScheduleBottomSheetStore((state) => state.setRef);
  const snapPoints = useMemo(() => ["100%"], []);
  useEffect(() => {
    if (ref) setRef(ref);
  }, [ref]);

  return (
    <BottomSheet
      index={-1}
      ref={ref}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose
      backgroundStyle={styles.bottomSheet}
      handleComponent={() => null}
    >
      <BottomSheetContent />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
});

export default CreateScheduleBottomSheet;
