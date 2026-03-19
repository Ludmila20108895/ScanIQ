import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Button,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  fetchAlternative,
  fetchProductByBarcode,
  ProductFromApi,
} from "../../api/productsApi";
import { BottomNav } from "../../components/BottomNav";
import { addToHistory } from "../../historyStore";
import { scanStyles as styles } from "../../styles/scanScreenStyles";
import { Product, RiskLevel } from "../../types/product";
import { getScoreLabel, getScoreMessage } from "../../utils/scoreHelpers"; // helper functions to get user-friendly score labels and messages

import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";

type LastScanInfo = {
  id: string;
  barcode: string;
  name: string;
  brand: string;
};

// ----- camera card props -----
function CameraCard(props: {
  onScanned: (result: BarcodeScanningResult) => void;
  animatedLineStyle: any;
}) {
  return (
    <View style={styles.cameraBox}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        onBarcodeScanned={props.onScanned}
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
  lastScan: LastScanInfo | null;
  score: number;
  notFound?: boolean;
  // errorMessage: string | null;
  onOpenProduct: () => void;
}) {
  const { lastScan, score, notFound, onOpenProduct } = props;

  return (
    <Pressable style={styles.resultCard} onPress={onOpenProduct}>
      {notFound ? (
        <Text style={styles.productName}>Product not found</Text>
      ) : (
        <Text style={styles.productName}>
          {lastScan ? lastScan.name : "Scan your product"}
        </Text>
      )}

      {lastScan && !notFound && (
        <>
          <Text style={styles.scoreLabel}>
            Health Score: {score}% ({getScoreLabel(score)})
          </Text>
          <Text style={styles.resultMessage}>{getScoreMessage(score)}</Text>
        </>
      )}

      {/* <Text style={{ color: "#f97316", marginTop: 8 }}>{errorMessage}</Text> */}
    </Pressable>
  );
}

// main screen
export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  //const [lastScanTime, setLastScanTime] = useState<number>(0);

  const [lastScan, setLastScan] = useState<LastScanInfo | null>(null);
  const [score, setScore] = useState(75);
  const [notFound, setNotFound] = useState(false);

  // const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const lineAnim = useRef(new Animated.Value(0)).current;
  const isScanning = useRef(false);

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
    if (isScanning.current) return;
    isScanning.current = true;

    const data = result.data ?? "";

    if (data.length < 5) {
      setTimeout(() => {
        isScanning.current = false;
      }, 3000);
      return;
    }
    try {
      setNotFound(false);

      // 1) Fetch product details from Open Food Facts
      const apiProduct: ProductFromApi | null =
        await fetchProductByBarcode(data);

      if (!apiProduct) {
        setNotFound(true);
        setTimeout(() => {
          isScanning.current = false;
        }, 3000);
        return;
      }

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
          shortImpact = "Very high sugar";
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
        imageUrl: apiProduct.imageUrl,
      };

      // 4) Fetch a better alternative from the same category
      const alternativeApi = await fetchAlternative(apiProduct);
      const alternative: Product | undefined = alternativeApi
        ? {
            id: alternativeApi.id,
            barcode: alternativeApi.id,
            name: alternativeApi.name,
            brand: alternativeApi.brand,
            score: alternativeApi.score,
            level: alternativeApi.level,
            negativeIngredients: [],
            positiveIngredients: [],
            imageUrl: alternativeApi.imageUrl,
          }
        : undefined;

      // 5) Update user interface and history
      setLastScan({
        id: product.id,
        barcode: product.barcode,
        name: product.name,
        brand: product.brand,
      } as any);
      setScore(product.score);

      await addToHistory(product, alternative);
      setTimeout(() => {
        isScanning.current = false;
      }, 1500);
    } catch {
      // setNotFound(true);
      setTimeout(() => {
        isScanning.current = false;
      }, 3000);
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
          <Image
            source={require("../../assets/images/Logo.png")}
            style={{
              width: 100,
              height: 100,
              resizeMode: "contain",
              marginBottom: 8,
            }}
          />
        </View>

        {/* camera */}
        <CameraCard
          onScanned={handleBarCodeScanned}
          animatedLineStyle={animatedLineStyle}
        />

        {/* result */}
        <ResultCard
          lastScan={lastScan}
          score={score}
          notFound={notFound}
          onOpenProduct={() => {
            if (!lastScan) return;
            // @ts-expect-error dynamic route is valid at runtime
            router.push("/product/" + lastScan.id);
          }}
        />
      </View>

      <BottomNav variant="scan" />
    </View>
  );
}
