import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { BottomNav } from "../../components/BottomNav";
import {
  deleteFavouriteItems,
  FavouriteItem,
  getFavourites,
} from "../../favouritesStore";
import { favouritesStyles as styles } from "../../styles/favouritesScreenStyles";

const colourForLevel = (level: FavouriteItem["product"]["level"]) => {
  switch (level) {
    case "bad":
      return "#ef4444";
    case "poor":
      return "#f97316";
    case "good":
      return "#22c55e";
    case "excellent":
      return "#16a34a";
    default:
      return "#9ca3af";
  }
};

export default function FavouritesScreen() {
  const [favourites, setFavourites] = useState<FavouriteItem[]>([]);

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const loadFavourites = async () => {
      const data = await getFavourites();
      setFavourites(data);
    };
    loadFavourites();
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleDelete = async () => {
    const filtered = favourites.filter(
      (item) => !selectedIds.includes(item.id),
    );

    setFavourites(filtered); // instant UI update

    await deleteFavouriteItems(selectedIds);

    setSelectedIds([]);
    setIsSelecting(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favourites</Text>

        <Pressable onPress={() => setIsSelecting((prev) => !prev)}>
          <Ionicons
            name={isSelecting ? "close" : "trash-outline"}
            size={24}
            color="#374151"
          />
        </Pressable>
      </View>

      {favourites.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={styles.empty}>No favourite products yet</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {favourites.map((item: FavouriteItem) => {
            const selected = selectedIds.includes(item.id);
            return (
              <Pressable
                key={item.id}
                style={[styles.itemCard, selected && styles.selectedCard]}
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
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <View
                    style={[
                      styles.colourDot,
                      { backgroundColor: colourForLevel(item.product.level) },
                    ]}
                  />

                  <View style={{ flex: 1 }}>
                    <Text style={styles.productName}>{item.product.name}</Text>
                    <Text style={styles.productBrand}>
                      {item.product.brand}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Text style={styles.scoreLabel}>{item.product.score}%</Text>

                  {isSelecting && (
                    <View style={styles.checkbox}>
                      {selected && <View style={styles.checkboxInner} />}
                    </View>
                  )}
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
      <BottomNav variant="favourites" />
    </View>
  );
}
