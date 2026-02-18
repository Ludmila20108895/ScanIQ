import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import { getFavourites, toggleFavourite } from "../../favouritesStore";
import { addToHistory } from "../../historyStore";
import { Product } from "../../types/product";
import { SAMPLE_SCANS } from "../data/sampleScans"; // sample scan data to simulate scanning different products with varying scores
import { getScoreLabel, getScoreMessage } from "../utils/scoreHelpers"; // helper functions to get user-friendly score labels and messages

function CameraCard(props: {
  onScanned: (result: BarcodeScanningResult) => void;
  scanned: boolean;
}) {
  return (
    <View style={styles.cameraBox}>
      <CameraView
        style={{ flex: 1, width: "100%" }}
        facing="back"
        onBarcodeScanned={props.scanned ? undefined : props.onScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8", "upc_a", "qr"],
        }}
      />
    </View>
  );
}

function ResultCard(props: {
  lastScan: (typeof SAMPLE_SCANS)[number] | null;
  score: number;
  errorMessage: string | null;
  onOpenProduct: () => void;
}) {
  const { lastScan, score, errorMessage, onOpenProduct } = props;

  return (
    <Pressable style={styles.resultCard} onPress={onOpenProduct}>
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
  );
}

// main screen
export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);

  const [lastScan, setLastScan] = useState<
    (typeof SAMPLE_SCANS)[number] | null
  >(null);
  const [score, setScore] = useState(75);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    if (scanned) return;
    setScanned(true);

    const data = result.data ?? "";

    if (data.length < 5) {
      setErrorMessage("Product not found");
      setLastScan(null);
      return;
    }

    setErrorMessage(null);

    let item = SAMPLE_SCANS[1];
    let newScore = 75;
    let level: "bad" | "poor" | "good" | "excellent" = "good";

    if (data.length % 3 === 0) {
      item = SAMPLE_SCANS[0];
      newScore = 22;
      level = "bad";
    } else if (data.length % 3 === 1) {
      item = SAMPLE_SCANS[1];
      newScore = 58;
    } else {
      item = SAMPLE_SCANS[2];
      newScore = 82;
      level = "excellent";
    }

    setLastScan(item);
    setScore(newScore);
    setIsFavourite(getFavourites().includes(item.id));

    const product: Product = {
      id: item.id,
      barcode: item.barcode,
      name: item.name,
      brand: item.brand,
      score: newScore,
      level,
      negativeIngredients: [
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
          Camera access is required to scan products.
        </Text>
        <Button title="Grant Camera Access" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>ScanIQ</Text>
        <Text style={styles.subtitle}>Scan the barcode to get started</Text>
      </View>

      {/* camera */}
      <CameraCard onScanned={handleBarCodeScanned} scanned={scanned} />

      {/* result */}
      <ResultCard
        lastScan={lastScan}
        score={score}
        errorMessage={errorMessage}
        onOpenProduct={() => {
          if (!lastScan) return;
          // @ts-expect-error dynamic route is valid at runtime
          router.push("/product/" + lastScan.id);
        }}
      />

      {errorMessage && (
        <Button
          title="Scan again"
          onPress={() => {
            setScanned(false);
            setErrorMessage(null);
          }}
        />
      )}

      {/* navigation card */}
      {lastScan && !errorMessage && (
        <View style={styles.navigationCard}>
          <View style={styles.buttonsRow}>
            <Pressable
              style={styles.navButton}
              onPress={() => {
                if (!lastScan) return;
                toggleFavourite(lastScan.id);
                setIsFavourite((prev) => !prev);
                router.push("/favourites");
              }}
            >
              <Text style={styles.navButtonTitle}>
                {isFavourite ? "Remove from Favourites" : "Add to Favourites"}
              </Text>
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
