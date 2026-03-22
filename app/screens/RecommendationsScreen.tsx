import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { BottomNav } from "../../components/BottomNav";
import { getHistory, HistoryItem } from "../../historyStore";
import { recommendationsStyles as styles } from "../../styles/recommendationsScreenStyles";

const colourForLevel = (level: HistoryItem["product"]["level"]) => {
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

export default function RecommendationsScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      const data = await getHistory();
      setHistory(data);
    };
    loadHistory();
  }, []);

  const recommended = history.filter((item) => item.product.score < 50); // Only show items where we have an alternative recommendation

  if (recommended.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}> No Recommendations yet</Text>
        </View>
        <BottomNav variant="recommendations" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.listContainer}>
        {recommended.map((item) => (
          <View key={item.id} style={styles.pairRow}>
            {/* left: scanned  product, to ProductDetailsScreen */}
            <Pressable
              style={styles.card}
              onPress={() => {
                // @ts-expect-error - we know item.id is a string
                router.push("/product/" + item.id);
              }}
            >
              <View style={styles.cardInner}>
                <View
                  style={[
                    styles.colourDot,
                    { backgroundColor: colourForLevel(item.product.level) },
                  ]}
                />
                <View style={styles.cardText}>
                  <Text style={styles.cardLabel}>Product scanned</Text>
                  <Text style={styles.cardName} numberOfLines={2}>
                    {item.product.name}
                  </Text>
                  <Text
                    style={[
                      styles.cardScore,
                      { color: colourForLevel(item.product.level) },
                    ]}
                  >
                    {item.product.score}%
                  </Text>
                </View>
              </View>
              <Text style={styles.chevron}>→</Text>
            </Pressable>

            {/* right : the alternative, to AlternativesScreen */}
            {item.alternative ? (
              <Pressable
                style={styles.card}
                onPress={() => {
                  // @ts-expect-error id is string at runtime
                  router.push("/alternatives?barcode=" + item.product.id);
                }}
              >
                <View style={styles.cardInner}>
                  <View
                    style={[
                      styles.colourDot,
                      {
                        backgroundColor: colourForLevel(item.alternative.level),
                      },
                    ]}
                  />
                  <View style={styles.cardText}>
                    <Text style={styles.cardLabel}>We recommend</Text>
                    <Text style={styles.cardName} numberOfLines={2}>
                      {item.alternative.name}
                    </Text>
                    <Text
                      style={[
                        styles.cardScore,
                        { color: colourForLevel(item.alternative.level) },
                      ]}
                    >
                      {item.alternative.score}%
                    </Text>
                  </View>
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>
            ) : (
              <View style={[styles.card, { opacity: 0.5 }]}>
                <View style={styles.cardInner}>
                  <View style={styles.colourDot} />
                  <View style={styles.cardText}>
                    <Text style={styles.cardLabel}>We reccommend</Text>
                    <Text style={styles.cardName}>
                      No better alternative found
                    </Text>
                    <Text style={styles.cardScore}>—</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      <BottomNav variant="recommendations" />
    </View>
  );
}
