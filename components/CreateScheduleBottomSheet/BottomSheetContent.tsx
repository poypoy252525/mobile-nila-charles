import { baseURL } from "@/api";
import { Schedule } from "@/types/schedule";
import { supabase } from "@/utils/supabase";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetView,
  useBottomSheet,
} from "@gorhom/bottom-sheet";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Appbar, IconButton, List } from "react-native-paper";

const BottomSheetContent = () => {
  const { forceClose } = useBottomSheet();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule>();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const fetchSchedules = async () => {
    try {
      const { data } = await axios.get(`${baseURL}/api/schedules`);
      console.log(data);
      setSchedules(data);
    } catch (error) {
      console.error("Error fetching schedules: ", error);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleScheduleSelect = async (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    bottomSheetModalRef.current?.present();
  };

  const handleConfirm = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log(session?.user.email);
      await axios.post(`${baseURL}/api/exams/schedules/set-schedule`, {
        ...selectedSchedule,
        email: session?.user.email,
      });
      bottomSheetModalRef.current?.close();
    } catch (error) {
      console.error("error confirm: ", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Appbar.Header elevated style={{ backgroundColor: "#fff", height: 50 }}>
          <Appbar.Action
            size={20}
            icon="close"
            onPress={() => {
              forceClose();
            }}
          />
          <Appbar.Content titleStyle={{ fontSize: 16 }} title="Schedules" />
          <Appbar.Action size={20} icon="plus" disabled />
        </Appbar.Header>

        <BottomSheetScrollView>
          <IconButton
            icon="refresh"
            onPress={() => {
              fetchSchedules();
            }}
          />
          <View style={{}}>
            {schedules.map((schedule) => (
              <List.Item
                title={new Date(schedule.date).toLocaleDateString("en-PH", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                description={`${schedule.exam.form.title}`}
                key={schedule.id}
                onPress={() => handleScheduleSelect(schedule)}
              />
            ))}
          </View>
          <BottomSheetModal
            enableOverDrag={false}
            backdropComponent={(props) => (
              <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
              />
            )}
            ref={bottomSheetModalRef}
          >
            <BottomSheetView>
              <List.Item title="Confirm" onPress={handleConfirm} />
              <List.Item
                title="Cancel"
                onPress={() => {
                  bottomSheetModalRef.current?.dismiss();
                }}
              />
            </BottomSheetView>
          </BottomSheetModal>
        </BottomSheetScrollView>
      </BottomSheetModalProvider>
    </View>
  );
};

export default BottomSheetContent;
