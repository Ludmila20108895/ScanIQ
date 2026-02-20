import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { getHistory, HistoryItem } from "../../historyStore";
import { BottomNav } from "../components/BottomNav";
import { historyStyles as styles } from "../styles/historyScreenStyles";

const colourForLevel = (level: HistoryItem["product"]["level"]) => {
  switch (level) {
    case "bad":
      return "#ef4444"; // red
    case "poor":
      return "#f97316"; // orange
    case "good":
      return "#22c55e"; // green
    case "excellent":
      return "#16a34a"; // darker green
  }
};

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]); // State to hold history items

  useEffect(() => {
    setHistory(getHistory()); // Load history items on component mount
  }, []); // Empty dependency array to run only once on mount

  return (
    <View style={styles.container}>
      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No history items yet</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContainer}>
          {history.map((item) => (
            <Pressable
              key={item.id}
              style={styles.row}
              onPress={() => {
                // @ts-expect-error - we know item.id is a string
                router.push("/product/" + item.id);
              }}
            >
              <View
                style={[
                  styles.colourDot,
                  { backgroundColor: colourForLevel(item.product.level) },
                ]}
              />

              <View style={styles.rowContent}>
                <Text style={styles.rowName}>{item.product.name}</Text>
                <Text style={styles.rowScore}>{item.product.score}%</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}
      <BottomNav variant="history" />
    </View>
  );
}
