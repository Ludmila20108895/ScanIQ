import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  fetchAlternatives,
  fetchProductByBarcode,
  ProductFromApi,
} from "../../api/productsApi";
import { alternativesStyles as styles } from "../../styles/alternativesScreenStyles";

const colourForLevel = (level: ProductFromApi["level"]) => {
  switch (level) {
    case "bad":
      return "#ef4444";
    case "poor":
      return "#f97316";
    case "good":
      return "#22c55e";
    case "excellent":
      return "#16a34a";
  }
};
export default function AlternativesScreen() {
  const { barcode } = useLocalSearchParams<{ barcode: string }>();

  const [alternatives, setAlternatives] = useState<ProductFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!barcode) {
      setLoading(false);
      setDone(true);
      return;
    }

    const load = async () => {
      setLoading(true);

      const apiProduct = await fetchProductByBarcode(barcode);

      if (!apiProduct) {
        setLoading(false);
        setDone(true);
        return;
      }

      // find a healthier alternative
      const list = await fetchAlternatives(apiProduct);
      setAlternatives(list);

      setLoading(false);
      setDone(true);
    };
    load();
  }, [barcode]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* loading state */}
      {loading && (
        <View style={styles.emptyCard}>
          <ActivityIndicator size="large" color="#72D8CF" />
          <Text style={[styles.emptyTitle, { marginTop: 12 }]}>
            Finding alternatives...
          </Text>
        </View>
      )}
      {/* done loading but no alternatives found */}
      {done && !loading && alternatives.length === 0 && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No alternative found</Text>
        </View>
      )}

      {/* the alternative product card */}
      {alternatives.map((alternative) => (
        <Pressable
          key={alternative.id}
          style={styles.altCard}
          onPress={() =>
            router.push({
              pathname: "/product/[id]",
              params: { id: alternative.id },
            })
          }
        >
          {alternative.imageUrl ? (
            <Image
              source={{ uri: alternative.imageUrl }}
              style={styles.productImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.productImagePlaceholder} />
          )}

          {/* name + brand + score */}
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{alternative.name}</Text>
            <Text style={styles.productBrand}>{alternative.brand}</Text>

            <View style={styles.scoreRow}>
              <View
                style={[
                  styles.levelDot,
                  { backgroundColor: colourForLevel(alternative.level) },
                ]}
              />
              <Text
                style={[
                  styles.levelLabel,
                  { color: colourForLevel(alternative.level) },
                ]}
              >
                {alternative.level.charAt(0).toUpperCase() +
                  alternative.level.slice(1)}
              </Text>
              <Text style={styles.scoreText}>{alternative.score}/100</Text>
            </View>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}
