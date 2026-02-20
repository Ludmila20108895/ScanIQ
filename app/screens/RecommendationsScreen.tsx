import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { getHistory, HistoryItem } from "../../historyStore";
import { BottomNav } from "../components/BottomNav";
import { recommendationsStyles as styles } from "../styles/recommendationsScreenStyles";

export default function RecommendationsScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  useEffect(() => {
    setHistory(getHistory());
  }, []);
  const recommended = history.filter((item) =>
    ["good", "excellent"].includes(item.product.level),
  );
  return (
    <View style={styles.container}>
      {recommended.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}> No Recommendations yet</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContainer}>
          {recommended.map((item) => (
            <Pressable
              key={item.id}
              style={styles.row}
              onPress={() => {
                // @ts-expect-error - we know item.id is a string
                router.push("/product/" + item.id);
              }}
            >
              {/* row content */}
            </Pressable>
          ))}
        </ScrollView>
      )}
      <BottomNav variant="recommendations" />
    </View>
  );
}
