import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { getFavourites } from "../../favouritesStore";

const HISTORY_ITEMS = [
  {
    id: "1",
    name: "Product A",
    brand: "Brand X",
    score: 85,
    level: "good",
  },
];

export default function FavouritesScreen() {
  const [favourites, setFavourites] = useState<string[]>(getFavourites());
  useEffect(() => {
    setFavourites(getFavourites());
  }, []);

  const favouriteItems = HISTORY_ITEMS.filter((item) =>
    favourites.includes(item.id),
  );
  if (favouriteItems.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>No Favourites yet</Text>
      </View>
    );
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {favouriteItems.map((item) => (
        <View key={item.id} style={styles.itemCard}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productBrand}>{item.brand}</Text>
          <Text style={styles.scoreLabel}>Score: {item.score}</Text>
          <Text style={styles.resultMessage}>
            This product is a {item.level} choice based on its nutritional
            profile.
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#ffffff" },
  empty: { fontSize: 16, color: "#4b5563" },
  itemCard: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f9fafb",
    marginBottom: 12,
  },
  productName: { fontSize: 18, fontWeight: "600" },
  productBrand: {
    color: "#6b7280",
  },
  scoreLabel: { marginTop: 8, color: "#111827" },
  resultMessage: { marginTop: 4, color: "#374151" },
});
