import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HomeCard } from "../components/HomeCard";

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoRow}>
        <Image
          source={require("../assets/images/Logo.png")}
          style={styles.logo}
        />
      </View>
      <View style={styles.cards}>
        <HomeCard
          label="Scan"
          color="#4F46E5"
          route="/scan"
          icon={<AntDesign name="scan" size={28} color="#ffffff" />}
        />
        <HomeCard
          label="History"
          color="#0369A1"
          route="/history"
          icon={<MaterialIcons name="history" size={28} color="#ffffff" />}
        />

        <HomeCard
          label="Favourites"
          color="#BE123C"
          route="/favourites"
          icon={<AntDesign name="heart" size={28} color="#ffffff" />}
        />
        <HomeCard
          label="Recommendations"
          color="#15803D"
          route="/recommendations"
          icon={<Ionicons name="sparkles-outline" size={28} color="#ffffff" />}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#72D8CF",
    paddingTop: 16,
    alignItems: "center",
  },
  logoRow: {
    width: "100%",
    alignItems: "center",
    paddingTop: 16,
    marginBottom: 24,
  },
  logo: {
    width: 160,
    height: 160,
    resizeMode: "contain",
    marginLeft: 8,
  },
  cards: {
    alignSelf: "stretch",
    paddingHorizontal: 16,
    flex: 1,
    gap: 12,
  },
});
