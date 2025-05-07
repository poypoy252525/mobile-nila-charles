import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <PaperProvider theme={MD3LightTheme}>
        <Stack
          screenOptions={{
            animation: "ios_from_right",
            statusBarStyle: "dark",
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)/register" />
        </Stack>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
