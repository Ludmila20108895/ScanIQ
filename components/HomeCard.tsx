// components/HomeCard.tsx
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type HomeCardProps = {
  label: string;
  color: string;
  route: string;
};

export function HomeCard({ label, color, route }: HomeCardProps) {
  return (
    <Pressable
      onPress={() => router.push({ pathname: route as any })}
      style={[styles.card, { backgroundColor: color }]}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1, // Take up available space
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});
