import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { getFavourites } from "../../favouritesStore";
import { getHistory, HistoryItem } from "../../historyStore";
import { BottomNav } from "../components/BottomNav";
import { favouritesStyles as styles } from "../styles/favouritesScreenStyles";

export default function FavouritesScreen() {
  const [favourites, setFavourites] = useState<string[]>(getFavourites());
  const [history, setHistory] = useState<HistoryItem[]>(getHistory());

  useEffect(() => {
    setFavourites(getFavourites());
    setHistory(getHistory());
  }, []);

  const favouriteItems = history.filter((item) => favourites.includes(item.id));

  return (
    <View style={styles.container}>
      {favouriteItems.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={styles.empty}>No favourite products yet</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {favouriteItems.map((item) => (
            <Pressable
              key={item.id}
              style={styles.itemCard}
              onPress={() => {
                // @ts-expect-error - we know item.id is a string
                router.push("/product/" + item.id);
              }}
            >
              <Text style={styles.productName}>{item.product.name}</Text>
              <Text style={styles.productBrand}>{item.product.brand}</Text>
              <Text style={styles.scoreLabel}>Score: {item.score}</Text>
              <Text style={styles.resultMessage}>
                This product is a {item.product.level} choice based on its
                nutritional profile.
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
      <BottomNav variant="favourites" />
    </View>
  );
}
