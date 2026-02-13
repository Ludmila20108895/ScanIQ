import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { getHistoryItemById } from "../../historyStore";
import { IngredientRisk, Product, RiskLevel } from "../../types/product";

const colourForRisk = (level: RiskLevel) => {
  switch (level) {
    case "risk_free":
      return "#22c55e"; // green
    case "to_watch":
      return "#eab308"; // yellow
    case "questionable":
      return "#f97316"; // orange
    case "high_risk":
      return "#ef4444"; // red
  }
};

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const historyItem = id ? getHistoryItemById(id) : null;
  const product: Product | null = historyItem ? historyItem.product : null;

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Product not found.</Text>
        <Button title="Back to Scan" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.brand}>{product.brand}</Text>
      </View>

      {/*  */}
      <View style={styles.scoreRow}>
        <View
          style={[
            styles.levelDot,
            {
              backgroundColor:
                product.level === "bad"
                  ? "#ef4444"
                  : product.level === "poor"
                    ? "#f97316"
                    : product.level === "good"
                      ? "#22c55e"
                      : "#16a34a",
            },
          ]}
        />
        <Text style={styles.scoreText}>{product.score}/100</Text>

        <Text style={styles.levelText}>
          {product.level.charAt(0).toUpperCase() + product.level.slice(1)}
        </Text>
      </View>

      {/* Negatives */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Negatives</Text>
        {product.negativeIngredients.length === 0 ? (
          <Text style={styles.sectionLine}>No negative ingredients.</Text>
        ) : (
          product.negativeIngredients.map((ing: IngredientRisk) => (
            <View key={ing.id} style={styles.ingredientRow}>
              <View
                style={[
                  styles.riskDot,
                  { backgroundColor: colourForRisk(ing.riskLevel) },
                ]}
              />
              <View style={styles.ingredientTextContainer}>
                <Text style={styles.ingredientName}>{ing.name}</Text>
                <Text style={styles.ingredientSubtitle}>
                  {ing.shortImpact}
                  {ing.quantityText ? ` · ${ing.quantityText}` : ""}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
      {/* Positives */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Positives</Text>
        {product.positiveIngredients.length === 0 ? (
          <Text style={styles.sectionLine}>
            No notable positive ingredients.
          </Text>
        ) : (
          product.positiveIngredients.map((ing: IngredientRisk) => (
            <View key={ing.id} style={styles.ingredientRow}>
              <View
                style={[
                  styles.riskDot,
                  { backgroundColor: colourForRisk(ing.riskLevel) },
                ]}
              />
              <View style={styles.ingredientTextContainer}>
                <Text style={styles.ingredientName}>{ing.name}</Text>
                <Text style={styles.ingredientSubtitle}>
                  {ing.shortImpact}
                  {ing.quantityText ? ` · ${ing.quantityText}` : ""}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Recommendations */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommendations</Text>
        <Text style={styles.sectionLine}>
          {product.score >= 75
            ? "This product is an excellent choice overall."
            : product.score >= 50
              ? "This product is okay, but there may be better options available."
              : "Consider limiting this product and choosing options with fewer risky ingredients."}
        </Text>
      </View>
    </ScrollView>
  );
}
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
    color: "#111827",
  },
  brand: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 8,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  levelDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 8,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
    color: "#111827",
  },
  levelText: {
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
  sectionLine: {
    fontSize: 14,
    color: "#4b5563",
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  riskDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
  },
  ingredientTextContainer: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
  },
  ingredientSubtitle: {
    fontSize: 13,
    color: "#6b7280",
  },
  error: {
    fontSize: 16,
    color: "#d32f2f",
    textAlign: "center",
  },
});
