import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { getHistoryItemById } from "../../historyStore";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  headerCard: {
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  score: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  level: {
    fontSize: 16,
    color: "#4b5563",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  error: {
    fontSize: 16,
    color: "#d32f2f",
    textAlign: "center",
  },
});

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = id ? getHistoryItemById(id) : null;

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Product not found.</Text>
        <Button title="Back to history" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.score}>{item.score}%</Text>
        <Text style={styles.level}>{item.level.toUpperCase()}</Text>
      </View>

      {/* reuse your existing sections: negative ingredients, positive, recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Negative ingredients</Text>
        <Text>- Salt...</Text>
        <Text>- Sugar...</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Positive ingredients</Text>
        <Text>- Fibre...</Text>
        <Text>- Protein...</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommendations</Text>
        <Text>
          {item.score >= 75
            ? "This product is an excellent choice overall."
            : "Consider limiting this product and choosing options with a higher score."}
        </Text>
      </View>
    </ScrollView>
  );
}
