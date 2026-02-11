import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { addToHistory } from "../../historyStore";

import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";

const SAMPLE_SCANS = [
  { id: "1", name: "Milk (1L)" },
  { id: "2", name: "Bread (Wholemeal)" },
  { id: "3", name: "Cheddar Cheese" },
];

// This screen shows a simulated scan result and health score
export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions(); // handle camera permissions
  const [scanned, setScanned] = useState(false); // track if a scan has been made to prevent multiple scans

  const [lastScan, setLastScan] = useState(SAMPLE_SCANS[1]); // demo last scanned item
  const [score, setScore] = useState(75); // demo health score

  useEffect(() => {
    // request camera permissions on mount
    if (!permission) {
      requestPermission(); // ask for permission if we don't have it yet
    }
  }, [permission, requestPermission]); // only run on mount and when permission state changes

  const getScoreLabel = (value: number) => {
    if (value <= 25) return "Bad";
    if (value <= 50) return "Poor";
    if (value <= 75) return "Good";
    return "Excellent";
  };

  const getScoreMessage = (value: number) => {
    // provide a user-friendly message based on the score
    if (value <= 25) {
      return "This product is not a healthy choice.";
    }
    if (value <= 50) {
      return "This product is rated as poor and should be consumed only occasionally.";
    }
    if (value <= 75) {
      return "This product is a good choice! It contains essential nutrients and has a balanced profile.";
    }
    return "This product has an excellent score and is a very good choice overall.";
  };

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    // handle the barcode scanning result
    if (scanned) return; // prevent multiple scans
    setScanned(true); // mark as scanned to prevent further scans until we reset

    const data = result.data ?? ""; // get the scanned data (barcode value)

    let item = SAMPLE_SCANS[1];
    let newScore = 75;
    let level: "bad" | "poor" | "good" | "excellent" = "good";

    if (data.length % 3 === 0) {
      // simulate different scan results based on the length of the scanned data
      item = SAMPLE_SCANS[0]; // set the last scanned item to the first sample item
      newScore = 22; // set a low score for this item
      level = "bad";
    } else if (data.length % 3 === 1) {
      // set the last scanned item to the second sample item and a medium score
      item = SAMPLE_SCANS[1]; // set the last scanned item to the second sample item
      newScore = 58; // set a medium score for this item
    } else {
      item = SAMPLE_SCANS[2]; // set the last scanned item to the third sample item
      newScore = 82; // set a high score for this item
      level = "excellent";
    }
    setLastScan(item); // update the last scanned item state
    setScore(newScore); // update the score state
    addToHistory({
      id: item.id,
      name: item.name,
      score: newScore,
      level,
    }); // add the scanned item to history with its score and level
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#888888" }}>Checking camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#888888", marginBottom: 12 }}>
          Camera access is required to scan products.{" "}
        </Text>
        <Button title="Grant Camera Access" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with app title and subtitle */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>ScanIQ</Text>
        <Text style={styles.subtitle}>Scan a barcode to get started</Text>
      </View>

      {/* Live camera view  */}
      <View style={styles.cameraBox}>
        <CameraView
          style={{ flex: 1, width: "100%" }}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "ean8", "upc_a", "qr"],
          }}
        />
      </View>

      {/* Last scanned item result card */}
      <View style={styles.resultCard}>
        <Text style={styles.resultLabel}>Last scanned item:</Text>
        <Text style={styles.productName}>{lastScan.name}</Text>

        <Text style={styles.scoreLabel}>
          Health Score: {score}% ({getScoreLabel(score)})
        </Text>

        <Text style={styles.resultMessage}>{getScoreMessage(score)}</Text>

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
