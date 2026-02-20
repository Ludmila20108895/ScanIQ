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

  const makeButton = (label: string, route: string, active: boolean) => (
    <Pressable
      key={label}
      onPress={() => goTo(route)}
      style={[styles.navButton, active && styles.navButtonActive]}
    >
      <Text
        style={[styles.navButtonText, active && styles.navButtonTextActive]}
      >
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {variant !== "scan" && makeButton("Scan", "/scan", pathname === "/scan")}
      {variant !== "favourites" &&
        makeButton("Fav", "/favourites", pathname === "/favourites")}
      {variant !== "history" &&
        makeButton("History", "/history", pathname === "/history")}
      {variant !== "recommendations" &&
        makeButton(
          "Recommend",
          "/recommendations",
          pathname === "/recommendations",
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#72D8CF",
    backgroundColor: "#72D8CF",
    gap: 8,
  },
  navButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 12,
    backgroundColor: "#fed7aa",
    alignItems: "center",
  },
  navButtonActive: {
    backgroundColor: "#fed7aa",
  },
  navButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  navButtonTextActive: {
    color: "#b45309",
  },
});
