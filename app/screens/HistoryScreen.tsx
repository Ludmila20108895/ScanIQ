import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { BottomNav } from "../../components/BottomNav";
import {
  deleteHistoryItems,
  getHistory,
  HistoryItem,
} from "../../historyStore";
import { historyStyles as styles } from "../../styles/historyScreenStyles";

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
  const [isSelecting, setIsSelecting] = useState(false); // State to track if we're in selection mode
  const [selectedIds, setSelectedIds] = useState<string[]>([]); // State to track selected item IDs for deletion

  useEffect(() => {
    const loadHistory = async () => {
      const data = await getHistory();
      setHistory(data);
    };
    loadHistory();
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };
  const handleDelete = async () => {
    await deleteHistoryItems(selectedIds);
    const updated = await getHistory();
    setHistory(updated);
    setSelectedIds([]);
    setIsSelecting(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>

        <Pressable
          onPress={() => setIsSelecting((prev) => !prev)}
          style={{ padding: 6 }}
        >
          <Ionicons
            name={isSelecting ? "close" : "trash-outline"}
            size={24}
            color="#374151"
          />
        </Pressable>
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No history items yet</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContainer}>
          {history.map((item) => {
            const selected = selectedIds.includes(item.id);
            return (
              <Pressable
                key={item.id}
                style={[
                  styles.row,
                  selectedIds.includes(item.id) && {
                    backgroundColor: "#d1fae5",
                  },
                ]}
                onPress={() => {
                  if (isSelecting) {
                    toggleSelect(item.id);
                  } else {
                    // @ts-expect-error - we know item.id is a string
                    router.push("/product/" + item.id);
                  }
                }}
              >
                <View
                  style={[
                    styles.colourDot,
                    { backgroundColor: colourForLevel(item.product.level) },
                  ]}
                />

                <View style={styles.rowContent}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowName}>{item.product.name}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.rowScore}>{item.product.score}%</Text>

                    {isSelecting && (
                      <View style={styles.checkbox}>
                        {selected && <View style={styles.checkboxInner} />}
                      </View>
                    )}
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
      {isSelecting && selectedIds.length > 0 && (
        <Pressable style={styles.deleteBar} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete ({selectedIds.length})</Text>
        </Pressable>
      )}

      <BottomNav variant="history" />
    </View>
  );
}
