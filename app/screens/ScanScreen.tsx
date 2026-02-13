import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import { addToHistory } from "../../historyStore";
import { Product } from "../../types/product";

import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";

const SAMPLE_SCANS = [
  { id: "1", barcode: "123456789012", name: "Milk (1L)", brand: "DairyBest" },
  {
    id: "2",
    barcode: "2222222222222",
    name: "Bread (Wholemeal)",
    brand: "BreadCo",
  },
  {
    id: "3",
    barcode: "3333333333333",
    name: "Cheddar Cheese",
    brand: "CheeseMakers",
  },
];

// This screen shows a simulated scan result and health score
export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions(); // handle camera permissions
  const [scanned, setScanned] = useState(false); // track if a scan has been made to prevent multiple scans

  const [lastScan, setLastScan] = useState<
    (typeof SAMPLE_SCANS)[number] | null
  >(null); // demo last scanned item
  const [score, setScore] = useState(75); // demo health score
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // state for error messages

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

    if (data.length < 5) {
      // simple validation to simulate product not found for short/invalid barcodes
      setErrorMessage("Product not found");
      setLastScan(null); // clear last scan info on error
      return; //
    }

    setErrorMessage(null); // clear previous errors

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

    const product: Product = {
      id: item.id,
      barcode: item.barcode,
      name: item.name,
      brand: item.brand,
      score: newScore,
      level,
      negativeIngredients: [
        // temporary demo data
        {
          id: "sugar",
          name: "Sugar",
          riskLevel: "high_risk",
          shortImpact: "Too sweet",
        },
      ],
      positiveIngredients: [
        {
          id: "fiber",
          name: "Fiber",
          riskLevel: "risk_free",
          shortImpact: "Good for digestion",
        },
      ],
    };
    addToHistory(product);
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
        <Text style={styles.subtitle}>Scan the barcode to get started</Text>
      </View>

      {/* Live camera card */}
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

      {/* result card */}
      <Pressable
        style={styles.resultCard}
        onPress={() => {
          if (!lastScan) return; // safety check
          //@ts-expect-error dynamic route string is valid at runtime
          router.push("/product/" + lastScan.id);
        }}
      >
        <Text style={styles.resultLabel}></Text>
        <Text style={styles.productName}>
          {lastScan ? lastScan.name : "Scan your product"}
        </Text>

        {lastScan && !errorMessage && (
          <>
            <Text style={styles.scoreLabel}>
              Health Score: {score}% ({getScoreLabel(score)})
            </Text>

            <Text style={styles.resultMessage}>{getScoreMessage(score)}</Text>
          </>
        )}

        {errorMessage && (
          <Text style={{ color: "#f97316", marginTop: 8 }}>{errorMessage}</Text>
        )}
      </Pressable>

      {errorMessage && (
        <Button
          title="Scan again"
          onPress={() => {
            setScanned(false);
            setErrorMessage(null);
          }}
        />
      )}

      {/* Navigation card – only when we have a valid scan */}
      {lastScan && !errorMessage && (
        <View style={styles.navigationCard}>
          <View style={styles.buttonsRow}>
            <Pressable
              style={styles.navButton}
              onPress={() => router.push("/favourites")}
            >
              <Text style={styles.navButtonTitle}>Favourites</Text>
            </Pressable>

            <Pressable
              style={styles.navButton}
              onPress={() => router.push("/history")}
            >
              <Text style={styles.navButtonTitle}>History</Text>
            </Pressable>
            <Pressable
              style={styles.navButton}
              onPress={() => router.push("/recommendations")}
            >
              <Text style={styles.navButtonTitle}>Recommendations</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f7",
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: 14,
    marginTop: 4,
  },
  cameraBox: {
    flex: 1.2,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  cameraText: {
    color: "#888888",
    fontSize: 14,
  },
  resultCard: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    marginBottom: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  resultLabel: {
    color: "#6b7280",
    fontSize: 13,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  productName: {
    color: "#111827",
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
    color: "#4b5563",
    fontSize: 13,
    marginBottom: 8,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  navigationCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    backgroundColor: "#ffffff",
    marginTop: 6,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },

  navigationTitle: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },

  navButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 8,
    paddingHorizontal: 6,
    backgroundColor: "#f9fafb",
    alignItems: "center",
  },

  navButtonTitle: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 2,
  },
});
