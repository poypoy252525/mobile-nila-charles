import { baseURL } from "@/api";
import CreateScheduleBottomSheet from "@/components/CreateScheduleBottomSheet/CreateScheduleBottomSheet";
import { useCreateScheduleBottomSheetStore } from "@/stores/useCreateScheduleBottomSheetStore";
import { useUserStore } from "@/stores/userStore";
import { Result } from "@/types/result";
import { Schedule } from "@/types/schedule";
import { supabase } from "@/utils/supabase";
import { User } from "@supabase/supabase-js";
import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import {
  Appbar,
  Card,
  FAB,
  IconButton,
  Portal,
  Surface,
} from "react-native-paper";

const index = () => {
  const bottomSheetRef = useCreateScheduleBottomSheetStore(
    (state) => state.ref
  );
  const [schedule, setSchedule] = useState<Schedule>();
  const [refreshing, setRefreshing] = useState(false);
  const [result, setResult] = useState<Result>();
  const [user, setUser] = useState<Student>();

  const verifyUser = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (!data || error) {
      router.replace("/login");
      return;
    }

    try {
      const { data: student } = await axios.get(
        `${baseURL}/api/students/${data.session?.user.email}`
      );

      setUser(student);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);

  const fetchStudentSchedules = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data } = await axios.get(
        `${baseURL}/api/students/schedules/${user?.email}`
      );
      setSchedule(data.schedules);
      console.log(data);
    } catch (error) {
      console.error("Error fetching student schedules", error);
    }
  };

  const fetchResult = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data } = await axios.get(
        `${baseURL}/api/students/result/${user?.email}`
      );
      console.log(data.score);
      setResult(data);
    } catch (error) {
      console.error("Error fetching result", error);
    }
  };

  useEffect(() => {
    fetchStudentSchedules();
    fetchResult();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStudentSchedules();
    await fetchResult();
    setRefreshing(false);
  };

  return (
    <Surface
      style={{
        position: "relative",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Appbar elevated style={{ backgroundColor: "#fff" }}>
        <Appbar.Content title="CDM Exam" />
        <Appbar.Action
          icon="account"
          onPress={() => {
            router.push(`/profile`);
          }}
        />
      </Appbar>
      {user?.status === "PENDING" ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text>Your credentials is being under review</Text>
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          style={{ flex: 1, width: "100%" }}
        >
          <View
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              rowGap: 12,
              paddingVertical: 12,
              paddingHorizontal: 12,
            }}
          >
            <Card style={{ width: "100%", backgroundColor: "#fff" }}>
              <Card.Title
                title="Exam Schedule"
                subtitle={
                  schedule
                    ? new Date(schedule?.date || "").toDateString()
                    : "No schedule yet"
                }
              />
            </Card>
            {result && result.score !== null && (
              <Card style={{ width: "100%", backgroundColor: "#fff" }}>
                <Card.Title
                  title="Exam result"
                  subtitle={`Score: ${result?.score}`}
                />
              </Card>
            )}
          </View>
        </ScrollView>
      )}

      <FAB
        icon="plus"
        style={{ position: "absolute", bottom: 16, right: 16 }}
        onPress={() => {
          // open bottom sheet
          if (schedule) {
            alert("You already set a schedule");
            return;
          }

          if (user?.status === "PENDING") {
            alert("The credentials you provide is being review.");
            return;
          }

          bottomSheetRef?.current?.expand();
        }}
      />
      <Portal>
        <CreateScheduleBottomSheet />
      </Portal>
    </Surface>
  );
};

export default index;
