import React from "react";
import { Button, Text, View } from "react-native";

function ScanScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: "white", fontSize: 20, marginBottom: 16 }}>
        ScanIQ
      </Text>
      <Button
        title="Go to Favourites"
        onPress={() => navigation.navigate("favourites")}
      />
    </View>
  );
}

export default function Home() {
  return <ScanScreen navigation={{ navigate: () => {} }} />;
}
