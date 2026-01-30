// app/_layout.tsx
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="favourites" options={{ title: "Favourites" }} />
      <Stack.Screen name="history" options={{ title: "History" }} />
      <Stack.Screen name="scan" options={{ title: "Scan" }} />
      <Stack.Screen
        name="recommendations"
        options={{ title: "Recommendations" }}
      />
    </Stack>
  );
}
