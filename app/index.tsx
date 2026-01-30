// app/index.tsx
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HomeCard } from "../components/HomeCard";

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <HomeCard label="Scan" color="#4F46E5" route="/scan" />
      <HomeCard label="History" color="#0369A1" route="/history" />
      <HomeCard label="Favourites" color="#BE123C" route="/favourites" />
      <HomeCard
        label="Recommendations"
        color="#15803D"
        route="/recommendations"
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
