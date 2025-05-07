import { baseURL } from "@/api";
import { useUserStore } from "@/stores/userStore";
import axios from "axios";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import Logo from "@/assets/images/CDM Logo.png";
import { supabase } from "@/utils/supabase";

const LoginScreen = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const setUser = useUserStore((state) => state.setStudent);

  const handleLoginSubmit = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        alert(`${error.message}`);
        return;
      }

      console.log(data.user);

      router.replace("/home");

      // const { data } = await axios.post<{ success: boolean; student: Student }>(
      //   `${baseURL}/api/students/login`,
      //   { email, studentId }
      // );

      // if (!data.success) {
      //   alert("Failed to login");
      //   return;
      // }

      // console.log(data.student);

      // router.replace("/home");
      // setUser(data.student);
    } catch (error) {
      console.error("failed to login", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <View
        style={{
          height: "35%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image source={Logo} style={{ width: 120, height: 120 }} />
      </View>

      <View style={{ padding: 24, rowGap: 12 }}>
        <TextInput
          value={email}
          onChangeText={(value) => setEmail(value)}
          mode="outlined"
          label="Email"
        />
        <TextInput
          value={password}
          onChangeText={(value) => setPassword(value)}
          mode="outlined"
          label="Password"
          secureTextEntry
        />
        <Button disabled={loading} mode="contained" onPress={handleLoginSubmit}>
          Login
        </Button>

        <Button onPress={() => router.push(`/register`)}>Register</Button>
      </View>
    </View>
  );
};

export default LoginScreen;

// try {
//   const { data } = await axios.post<{ success: boolean; student: Student }>(
//     `${baseURL}/api/students/login`,
//     { email, studentId }
//   );
//   if (!data.success) {
//     alert("Failed to login");
//     return;
//   }

//   router.replace("/home");
//   setUser(data.student);
// } catch (error) {
//   console.error("failed to login", error);
// }
