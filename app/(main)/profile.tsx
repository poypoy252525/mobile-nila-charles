import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import axios from "axios";
import { baseURL } from "@/api";
import { Button, List } from "react-native-paper";
import { supabase } from "@/utils/supabase";
import { router } from "expo-router";

const profile = () => {
  const user = useUserStore((state) => state.student);
  const [student, setStudent] = useState<Student>();

  const info = [
    { title: "First Name", description: student?.firstName },
    { title: "Last Name", description: student?.lastName },
    {
      title: "Birth date",
      description: new Date(student?.birthdate || "").toLocaleDateString(
        "en-PH",
        { month: "long", day: "2-digit", year: "numeric" }
      ),
    },
    { title: "Email", description: student?.email },
    { title: "Phone", description: student?.phone },
    { title: "Sex", description: student?.sex },
    { title: "Status", description: student?.status },
  ];

  const fetchStudentInfo = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data } = await axios.get<Student>(
        `${baseURL}/api/students/${user?.email}`
      );
      setStudent(data);
    } catch (error) {
      console.error("Error fetching student Info", error);
    }
  };

  useEffect(() => {
    fetchStudentInfo();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 12 }}>
      <Text style={{ fontSize: 20 }}>{`${student?.fullName}`}</Text>
      <Text
        style={{ opacity: 0.5 }}
      >{`Student ID: ${student?.studentId}`}</Text>
      <List.Section>
        <List.Subheader>More info</List.Subheader>
        {info.map((item, index) => (
          <List.Item
            key={index}
            title={item.title}
            description={`${item.description}`}
            descriptionStyle={{ opacity: 0.7 }}
          />
        ))}
      </List.Section>
      <Button
        icon="logout"
        onPress={async () => {
          try {
            await supabase.auth.signOut();
            router.replace("/login");
          } catch (error) {
            console.error(error);
          }
        }}
      >
        Logout
      </Button>
    </View>
  );
};

export default profile;
