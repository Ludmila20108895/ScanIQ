import React, { useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { getFavourites, toggleFavourite } from "../favouritesStores";

const HISTORY_ITEMS = [
  {
    id: "1",
    name: "Product A",
    brand: "Brand X",
    score: 85,
    level: "good",
  },
];

export default function HistoryScreen() {
  const item = HISTORY_ITEMS[0]; // Simulate fetching the most recent history item

  const [favourites, setFavourites] = useState<string[]>(getFavourites());

  const isFavourite = favourites.includes(item.id);

  const onToggleFavourites = () => {
    toggleFavourite(item.id);
    setFavourites(getFavourites());
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* product title and details */}
      <View style={styles.headerCard}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productBrand}>{item.brand}</Text>

        <Text style={styles.scoreLabel}>Score: {item.score}</Text>
        <Text style={styles.resultMessage}>
          This product is a {item.level} choice based on its nutritional
          profile.
        </Text>
      </View>

      {/* Example sections: ingredients, nutrition facts, etc. */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}> Negative Ingredients</Text>
        <Text style={styles.sectionLine}>- Salt...</Text>
        <Text style={styles.sectionLine}>- Sugar...</Text>
        <Text style={styles.sectionLine}>- Energy ...</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}> Positive Ingredients</Text>
        <Text style={styles.sectionLine}>- Fiber...</Text>
        <Text style={styles.sectionLine}>- Protein...</Text>
        <Text style={styles.sectionLine}>- Vitamins...</Text>
      </View>

      {/* Recomendations placeholder */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommendations</Text>
        <Text style={styles.sectionLine}>
          This product rate is good based on its nutritional profile. Consider
          adding more fiber to your diet.
        </Text>
      </View>

      {/* Add to favourites button */}
      <View style={styles.bottomActions}>
        <Button
          title={isFavourite ? "Remove from Favourites" : "Add to Favourites"}
          onPress={onToggleFavourites}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#f9fafb",
    marginBottom: 16,
  },
  productName: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  resultMessage: {
    fontSize: 16,
    color: "#374151",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  sectionLine: {
    fontSize: 14,
    color: "#4b5563",
    marginLeft: 8,
    marginBottom: 2,
  },
  bottomActions: {
    marginTop: 16,
    alignItems: "center",
    marginBottom: 32,
  },
});
