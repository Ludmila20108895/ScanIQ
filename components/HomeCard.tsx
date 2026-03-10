import { router } from "expo-router";
import React, { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type HomeCardProps = {
  label: string;
  color: string;
  route: string;
  icon?: ReactNode;
};

export function HomeCard({ label, color, route, icon }: HomeCardProps) {
  return (
    <Pressable
      onPress={() => router.push({ pathname: route as any })}
      style={[styles.card, { backgroundColor: color }]}
    >
      <View style={styles.content}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text style={styles.text}>{label}</Text>
      </View>
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
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 16,
  },
  icon: {
    width: 32,
    alignItems: "center",
  },
});
