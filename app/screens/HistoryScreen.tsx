import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { getHistory, HistoryItem } from "../../historyStore";

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]); // State to hold history items

  useEffect(() => {
    setHistory(getHistory()); // Load history items on component mount
  }, []); // Empty dependency array to run only once on mount

  if (history.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No history items yet</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.listContainer}>
      {history.map((item) => (
        <Pressable
          key={item.id}
          style={styles.row}
          onPress={() => {
            // @ts-expect-error dynamic route string is valid at runtime
            router.push("/product/" + item.id);
          }}
        >
          <View
            style={[
              styles.colourDot,
              { backgroundColor: colourForLevel(item.level) },
            ]}
          />

          <View style={styles.rowContent}>
            <Text style={styles.rowName}>{item.name}</Text>
            <Text style={styles.rowScore}>{item.score}%</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  listContainer: { padding: 16 },
  row: {
    flexDirection: "row",
    borderRadius: 12,
    backgroundColor: "#f9fafb",
    marginBottom: 8,
    overflow: "hidden",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  colourDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 12,
    marginTop: 10,
  },
  rowContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  rowName: { fontSize: 16, fontWeight: "600" },
  rowScore: { fontSize: 16, color: "#6b5563" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: { color: "#6b7280" },

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
    fontWeight: "bold",
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
const colourForLevel = (level: HistoryItem["level"]) => {
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
