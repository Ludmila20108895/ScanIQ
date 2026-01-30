import { router } from "expo-router";
import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

const SAMPLE_SCANS = [
  { id: "1", name: "Milk (1L)" },
  { id: "2", name: "Bread (Wholemeal)" },
  { id: "3", name: "Cheddar Cheese" },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
});

export default function ScanScreen() {
  const [favourites, setFavourites] = useState<string[]>([]);

  const toggleFavourites = (id: string) => {
    setFavourites((current) =>
      current.includes(id)
        ? current.filter((favId) => favId !== id)
        : [...current, id],
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ScanIQ</Text>
      <Button
        title="Go to Favourites"
        onPress={() => router.push("/favourites")}
      />
      {SAMPLE_SCANS.map((scan) => {
        const isFavourite = favourites.includes(scan.id);
        return (
          <View key={scan.id} style={{ marginTop: 20, alignItems: "center" }}>
            <Text style={{ color: "white", fontSize: 18 }}>{scan.name}</Text>
            <Button
              title={
                isFavourite ? "Remove from Favourites" : "Add to Favourites"
              }
              onPress={() => toggleFavourites(scan.id)}
            />
          </View>
        );
      })}
    </View>
  );
}
