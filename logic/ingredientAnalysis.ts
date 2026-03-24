import { ProductFromApi } from "../api/productsApi";

export type IngredientRisk = {
  id: string;
  name: string;
  riskLevel: "risk_free" | "medium_risk" | "high_risk";
  shortImpact: string;
  quantityText?: string;
};

// Simple ingredient analysis
export function analyzeIngredients(product: ProductFromApi): {
  positives: IngredientRisk[];
  negatives: IngredientRisk[];
} {
  const positives: IngredientRisk[] = [];
  const negatives: IngredientRisk[] = [];

  // --- NEGATIVES ---
  if (product.nutriments?.sugars_100g && product.nutriments.sugars_100g > 15) {
    negatives.push({
      id: "sugar",
      name: "High Sugar",
      riskLevel: "high_risk",
      shortImpact: "High sugar intake can increase risk of obesity",
    });
  }

  if (product.additivesTags && product.additivesTags.length >= 3) {
    negatives.push({
      id: "additives",
      name: "Many additives",
      riskLevel: "medium_risk",
      shortImpact: "Contains multiple additives which may impact health",
    });
  }

  if (product.nutriments?.salt_100g && product.nutriments.salt_100g > 1.5) {
    negatives.push({
      id: "salt",
      name: "High Salt",
      riskLevel: "high_risk",
      shortImpact: "High salt can increase blood pressure",
    });
  }

  // --- POSITIVES ---
  if (product.nutriments?.fiber_100g && product.nutriments.fiber_100g > 3) {
    positives.push({
      id: "fiber",
      name: "Good Fiber",
      riskLevel: "risk_free",
      shortImpact: "Fiber helps digestion and gut health",
    });
  }

  if (product.labelsTags?.includes("en:organic")) {
    positives.push({
      id: "organic",
      name: "Organic",
      riskLevel: "risk_free",
      shortImpact: "Produced with higher quality standards",
    });
  }

  return { positives, negatives };
}
