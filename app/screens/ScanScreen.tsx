import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, Pressable, Text, View } from "react-native";
import { addToHistory } from "../../historyStore";
import { Product } from "../../types/product";
import { BottomNav } from "../components/BottomNav";
import { SAMPLE_SCANS } from "../data/sampleScans"; // sample scan data to simulate scanning different products with varying scores
import { scanStyles as styles } from "../styles/scanScreenStyles";
import { getScoreLabel, getScoreMessage } from "../utils/scoreHelpers"; // helper functions to get user-friendly score labels and messages

import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";

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

      <BottomNav variant="scan" />
    </View>
  );
}
