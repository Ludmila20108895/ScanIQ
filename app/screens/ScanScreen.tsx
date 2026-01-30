import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export type Navigation = {
  navigate: (screen: string) => void;
};

type Props = {
  navigation: Navigation;
};

export default function ScanScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ScanIQ</Text>
      <Button
        title="Go to Favourites"
        onPress={() => navigation.navigate("favourites")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "white",
    fontSize: 20,
    marginBottom: 16,
  },
});
