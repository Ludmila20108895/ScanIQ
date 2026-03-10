import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { BottomNav } from "../../components/BottomNav";
import { getHistory, HistoryItem } from "../../historyStore";
import { recommendationsStyles as styles } from "../../styles/recommendationsScreenStyles";

export default function RecommendationsScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const recommended = history.filter((item) =>
    ["good", "excellent"].includes(item.product.level),
  );

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
            {/* left: scanned */}

            <Pressable
              style={styles.card}
              onPress={() => {
                // @ts-expect-error - we know item.id is a string
                router.push("/product/" + item.id);
              }}
            >
              <Text style={styles.cardLabel}>Procuct scanned</Text>
              <Text style={styles.cardName}>{item.product.name}</Text>
              <Text style={styles.cardScore}>{item.product.score}%</Text>
            </Pressable>

            {/* right : the alternative */}
            <Pressable
              style={styles.card}
              onPress={() => {
                const target = item.alternative ?? item.product;
                // @ts-expect-error id is string at runtime
                router.push("/product/" + target.id);
              }}
            >
              <Text style={styles.cardLabel}>We recommend</Text>
              <Text style={styles.cardName}>
                {item.alternative?.name ?? item.product.name}
              </Text>
              <Text style={styles.cardScore}>
                {(item.alternative ?? item.product).score}%
              </Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
      <BottomNav variant="recommendations" />
    </View>
  );
}
