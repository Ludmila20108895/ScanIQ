import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Button,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { fetchProductByBarcode, ProductFromApi } from "../../api/productsApi";
import { addToHistory } from "../../historyStore";
import { Product, RiskLevel } from "../../types/product";
import { BottomNav } from "../components/BottomNav";
import { SAMPLE_SCANS } from "../data/sampleScans"; // sample scan data to simulate scanning different products with varying scores
import { scanStyles as styles } from "../styles/scanScreenStyles";
import { getScoreLabel, getScoreMessage } from "../utils/scoreHelpers"; // helper functions to get user-friendly score labels and messages

import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";

// ----- helper: to choose alternative with score >= 70% -----
function pickAlternative(
  all: Product[],
  current: Product,
): Product | undefined {
  // products with score >= 70 and not the same id
  const candidates = all.filter((p) => p.id !== current.id && p.score >= 70);
  if (candidates.length === 0) return undefined;

  // choose the one with highest score
  return candidates.reduce((best, p) => (p.score > best.score ? p : best));
}

// ----- camera card props -----
function CameraCard(props: {
  onScanned: (result: BarcodeScanningResult) => void;
  scanned: boolean;
  animatedLineStyle: any;
}) {
  return (
    <View style={styles.cameraBox}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        onBarcodeScanned={props.scanned ? undefined : props.onScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8", "upc_a", "qr"],
        }}
      />
      {/* dim overlay to make it look nicer */}
      <View style={styles.cameraDim} />

      {/* scane frame */}
      <View style={styles.scanFrame}>
        <View style={styles.scanInner} />
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />
        <Animated.View style={[styles.scanLine, props.animatedLineStyle]} />
      </View>
    </View>
  );
}
// ------ result card ------
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

  const lineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(lineAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(lineAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [lineAnim]);

  const animatedLineStyle = {
    transform: [
      {
        translateY: lineAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 160],
        }),
      },
    ],
  };

  const handleBarCodeScanned = async (result: BarcodeScanningResult) => {
    if (scanned) return;
    setScanned(true);

    const data = result.data ?? "";

    if (data.length < 5) {
      setErrorMessage("Product not found");
      setLastScan(null);
      setScanned(true);
      return;
    }
    try {
      setErrorMessage(null);

      // 1) Call the Api
      const apiProduct: ProductFromApi = await fetchProductByBarcode(data);

      // 2) Build negative / positive ingredients from API data
      const negativeIngredients: Product["negativeIngredients"] = [];
      const positiveIngredients: Product["positiveIngredients"] = [];

      const ingredientsText = apiProduct.ingredientsText?.toLowerCase() ?? "";
      const n = apiProduct.nutriments ?? {};
      const sugars = n["sugars_100g"] as number | undefined;
      const satFat = n["saturated-fat_100g"] as number | undefined;
      const salt = n["salt_100g"] as number | undefined;
      const fiber = n["fiber_100g"] as number | undefined;

      // just a simple rule: sugar mentioned in ingredients -> negative
      if (sugars !== undefined && sugars >= 5) {
        let riskLevel: RiskLevel = "medium_risk";
        let shortImpact = "Moderate sugar content";

        if (sugars >= 20) {
          riskLevel = "high_risk";
          shortImpact = "Very high sugar content";
        } else if (sugars >= 10) {
          riskLevel = "questionable";
          shortImpact = "High sugar content";
        }
        negativeIngredients.push({
          id: "sugar",
          name: "Sugar",
          riskLevel,
          shortImpact,
          quantityText: `${sugars.toFixed(1)} g / 100 g`,
        });
      }

      // Saturated fat risk
      if (satFat !== undefined && satFat >= 2) {
        let riskLevel: RiskLevel = "medium_risk";
        let shortImpact = "Moderate saturated fat";

        if (satFat >= 10) {
          riskLevel = "high_risk";
          shortImpact = "Very high saturated fat";
        } else if (satFat >= 5) {
          riskLevel = "questionable";
          shortImpact = "High saturated fat";
        }
        negativeIngredients.push({
          id: "sat_fat",
          name: "Saturated Fat",
          riskLevel,
          shortImpact,
          quantityText: `${satFat.toFixed(1)} g / 100 g`,
        });
      }

      // Salt risk
      if (salt !== undefined && salt >= 0.3) {
        let riskLevel: RiskLevel = "medium_risk";
        let shortImpact = "Moderate salt";

        if (salt >= 1.5) {
          riskLevel = "high_risk";
          shortImpact = "Very high salt content";
        } else if (salt >= 0.9) {
          riskLevel = "questionable";
          shortImpact = "High salt content";
        }

        negativeIngredients.push({
          id: "salt",
          name: "Salt",
          riskLevel,
          shortImpact,
          quantityText: `${salt.toFixed(2)} g / 100 g`,
        });
      }

      // Additives risk
      if ((apiProduct.additivesTags ?? []).length > 0) {
        negativeIngredients.push({
          id: "additives",
          name: "Food additives",
          riskLevel: "medium_risk",
          shortImpact: "Contains food additives",
          quantityText: `${apiProduct.additivesTags!.length} additive(s)`,
        });
      }
      // fiber >= 3g/100g -> positive
      if (fiber !== undefined && fiber >= 3) {
        let shortImpact = "Good fiber content";
        if (fiber >= 6) shortImpact = "Very high fiber content";

        positiveIngredients.push({
          id: "fiber",
          name: "Fiber",
          riskLevel: "risk_free",
          shortImpact,
          quantityText: `${fiber.toFixed(1)} g / 100 g`,
        });
      }

      // Whole grains / oats / nuts as positives (from ingredients text)
      if (
        ingredientsText.includes("whole") ||
        ingredientsText.includes("integral")
      ) {
        positiveIngredients.push({
          id: "whole_grains",
          name: "Whole grains",
          riskLevel: "risk_free",
          shortImpact: "Contains whole grains",
        });
      }

      if (ingredientsText.includes("oat")) {
        positiveIngredients.push({
          id: "oats",
          name: "Oats",
          riskLevel: "risk_free",
          shortImpact: "Oat-based product",
        });
      }
      if (
        ingredientsText.includes("nut") ||
        ingredientsText.includes("almond")
      ) {
        positiveIngredients.push({
          id: "nuts",
          name: "Nuts",
          riskLevel: "risk_free",
          shortImpact: "Contains nuts",
        });
      }

      // 3) Map ProductFromApi -> app Product
      const product: Product = {
        id: apiProduct.id,
        barcode: data,
        name: apiProduct.name,
        brand: apiProduct.brand,
        score: apiProduct.score,
        level: apiProduct.level,
        negativeIngredients,
        positiveIngredients,
      };

      // 4) Choses main product with higher score
      const alternative = pickAlternative(SAMPLE_SCANS as Product[], product);

      // 5) Update user interface and history
      setLastScan({
        id: product.id,
        barcode: product.barcode,
        name: product.name,
        brand: product.brand,
      } as any);
      setScore(product.score);

      addToHistory(product, alternative);
    } catch (e) {
      console.error(e);

      // Fall back to Sample_SCan if api fails
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

      const alternative = pickAlternative(SAMPLE_SCANS as Product[], product);
      addToHistory(product, alternative);

      setErrorMessage("Could not reach product API");
      setScanned(false);
    }
  };

  if (!permission) {
    return (
      <View style={{ flex: 1, backgroundColor: "#72D8CF", padding: 16 }}>
        <Text style={{ color: "#888888" }}>Checking camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, backgroundColor: "#72D8CF", padding: 16 }}>
        <Text style={{ color: "#888888", marginBottom: 12 }}>
          Camera access is required to scan products.
        </Text>
        <Button title="Grant Camera Access" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#72D8CF" }}>
      {/* content area */}
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>ScanIQ</Text>
          <Text style={styles.subtitle}>Scan the barcode to get started</Text>
        </View>

        {/* camera */}
        <CameraCard
          onScanned={handleBarCodeScanned}
          scanned={scanned}
          animatedLineStyle={animatedLineStyle}
        />

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
      </View>

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
