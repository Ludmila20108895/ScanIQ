import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, usePathname } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  variant: "scan" | "favourites" | "history" | "recommendations";
};

export function BottomNav({ variant }: Props) {
  const pathname = usePathname();

  const goTo = (route: string) => {
    if (pathname === route) return;
    // @ts-expect-error dynamic route
    router.push(route);
  };

  const makeButton = (
    label: string,
    route: string,
    active: boolean,
    icon: React.ReactNode,
    color: string,
  ) => (
    <Pressable
      key={label}
      onPress={() => goTo(route)}
      style={[
        styles.navButton,
        { backgroundColor: color },
        active && styles.navButtonActive,
      ]}
    >
      {icon}
      <Text
        style={[styles.navButtonText, active && styles.navButtonTextActive]}
      >
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {variant !== "scan" &&
          makeButton(
            "Scan",
            "/scan",
            pathname === "/scan",
            <AntDesign name="scan" size={20} color="#ffffff" />,
            "#4F46E5",
          )}
        {variant !== "favourites" &&
          makeButton(
            "Fav",
            "/favourites",
            pathname === "/favourites",
            <AntDesign name="heart" size={20} color="#ffffff" />,
            "#BE123C",
          )}
        {variant !== "history" &&
          makeButton(
            "History",
            "/history",
            pathname === "/history",
            <MaterialIcons name="history" size={20} color="#ffffff" />,
            "#0369A1",
          )}
        {variant !== "recommendations" &&
          makeButton(
            "Recs",
            "/recommendations",
            pathname === "/recommendations",
            <Ionicons name="sparkles-outline" size={20} color="#ffffff" />,
            "#15803D",
          )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
    backgroundColor: "#72D8CF",
  },
  container: {
    flexDirection: "row",
    borderRadius: 999,
    padding: 8,
    backgroundColor: "#72D8CF",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    gap: 10,
  },
  navButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  navButtonActive: {
    opacity: 0.9,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  navButtonTextActive: {
    textDecorationLine: "underline",
  },
});
