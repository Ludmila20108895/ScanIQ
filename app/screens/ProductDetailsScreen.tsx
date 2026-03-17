import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { isFavourite, toggleFavourite } from "../../favouritesStore";
import { getHistoryItemById } from "../../historyStore";
import { styles } from "../../styles/productDetailsStyles";
import { IngredientRisk, Product, RiskLevel } from "../../types/product";

const colourForScore = (score: number) => {
  if (score >= 75) return "#16a34a"; // green
  if (score >= 50) return "#eab308"; // yellow
  if (score >= 25) return "#f97316"; // orange
  return "#ef4444"; // red
};

const colourForRisk = (level: RiskLevel) => {
  switch (level) {
    case "risk_free":
      return "#22c55e";
    case "medium_risk":
      return "#eab308";
    case "questionable":
      return "#f97316";
    case "high_risk":
      return "#ef4444";
  }
};

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [favouriteState, setFavouriteState] = useState<boolean>(false);

  // Load product details and favourite status asynchronously when ID changes
  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const historyItem = await getHistoryItemById(id);
      if (historyItem) {
        setProduct(historyItem.product);
        const favouriteStatus = await isFavourite(historyItem.product.id);
        setFavouriteState(favouriteStatus);
      }
    };
    load();
  }, [id]);

  if (!product) {
    return (
      <View style={styles.emptyContainer}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back to Scan</Text>
        </Pressable>
      </View>
    );
  }

  const levelLabel =
    product.level.charAt(0).toUpperCase() + product.level.slice(1);

  const handleToggleFavourite = async () => {
    if (!product) return;
    await toggleFavourite(product); // pass full product object
    setFavouriteState((prev) => !prev);
  };

  const recommendationText =
    product.score >= 75
      ? "This product is an excellent choice overall."
      : product.score >= 50
        ? "This product is okay, but there may be better options available."
        : "Consider limiting this product and choosing options with fewer risky ingredients.";
  const renderNutrientCard = (label: string, value: string) => (
    <View key={label} style={styles.nutrientCard}>
      <Text style={styles.nutrientLabel}>{label}</Text>
      <Text style={styles.nutrientValue}>{value}</Text>
    </View>
  );
  const hasNutritions = false; // placeholder until we have real data

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Nutrient summary and only will show if is available */}
      {hasNutritions && (
        <View style={styles.nutrientRow}>
          {renderNutrientCard("Calories", "—")}
          {renderNutrientCard("Protein", "—")}
          {renderNutrientCard("Fat", "—")}
          {renderNutrientCard("Carbs", "—")}
        </View>
      )}

      {/* Product card   */}
      <View style={styles.productCard}>
        <View style={styles.productHeaderRow}>
          <View style={styles.productTextBlock}>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.brand}>{product.brand}</Text>

            {product.imageUrl && (
              <Image
                source={{ uri: product.imageUrl }}
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: 12,
                  marginTop: 12,
                }}
                resizeMode="contain"
              />
            )}
          </View>

          <View style={styles.scoreBlock}>
            <View
              style={[
                styles.levelDot,
                { backgroundColor: colourForScore(product.score) },
              ]}
            />
            <Text style={styles.scoreText}>{product.score}/100</Text>
            <Text style={styles.levelText}>{levelLabel}</Text>
          </View>
        </View>
      </View>
      {/* Heart favourite toggle */}
      <Pressable
        onPress={handleToggleFavourite}
        style={styles.favRow}
        hitSlop={8}
      >
        <Text style={styles.favText}>
          {favouriteState ? "Remove from favourites" : "Add to favourites"}
        </Text>
        <Text
          style={[styles.favHeart, favouriteState && styles.favHeartActive]}
        >
          {favouriteState ? "♥" : "♡"}
        </Text>
      </Pressable>

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
                  { backgroundColor: colourForScore(product.score) },
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
        <Text style={styles.sectionLine}>{recommendationText}</Text>
      </View>
    </ScrollView>
  );
}
