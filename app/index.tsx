import App from "@/components/PushNotification";
import { supabase } from "@/utils/supabase";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";

const index = () => {
  const checkUserSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (data) {
        router.replace(`/home`);
      } else {
        router.replace("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkUserSession();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <App />
    </View>
  );
};

export default index;
