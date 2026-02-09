import { router } from "expo-router";
import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

const SAMPLE_SCANS = [
  { id: "1", name: "Milk (1L)" },
  { id: "2", name: "Bread (Wholemeal)" },
  { id: "3", name: "Cheddar Cheese" },
];

export default function ScanScreen() {
  const [lastScan] = useState(SAMPLE_SCANS[1]); // Simulate last scanned item

  return (
    <View style={styles.container}>
      {/* Header with app title and subtitle */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>ScanIQ</Text>
        <Text style={styles.subtitle}>Scan a barcode to get started</Text>
      </View>

      {/* camera preview would go here */}
      <View style={styles.cameraBox}>
        <Text style={styles.cameraText}>[Camera Preview]</Text>
      </View>

      {/* Simulated last scanned item with favourite toggle */}
      <View style={styles.resultCard}>
        <Text style={styles.resultLabel}>Last Scanned Item:</Text>
        <Text style={styles.productName}>{lastScan.name}</Text>

        <Text style={styles.scoreLabel}>Health Score: 75% (example)</Text>
        <Text style={styles.resultMessage}>
          This product is a good choice! It contains essential nutrients and has
          a balanced profile.
        </Text>

        <View style={styles.buttonsRow}>
          <Button
            title="View details"
            onPress={() => router.push("/history" as any)}
          />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    color: "#cccccc",
    fontSize: 14,
    marginTop: 4,
  },
  cameraBox: {
    flex: 1.2,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#333333",
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  cameraText: {
    color: "#888888",
    fontSize: 14,
  },
  resultCard: {
    flex: 0.9,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#333333",
    padding: 16,
    backgroundColor: "#121212",
  },
  resultLabel: {
    color: "#aaaaaa",
    fontSize: 13,
    marginBottom: 4,
  },
  productName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  scoreLabel: {
    color: "#4ade80",
    fontSize: 16,
    marginBottom: 8,
  },
  resultMessage: {
    color: "#e5e5e5",
    fontSize: 14,
    marginBottom: 12,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
});
