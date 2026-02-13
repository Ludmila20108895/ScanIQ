export type RiskLevel = "risk_free" | "to_watch" | "questionable" | "high_risk";

export type IngredientRisk = {
  id: string;
  name: string;
  riskLevel: RiskLevel;
  shortImpact: string; // e.g. "Too sweet", "Low impact"
  quantityText?: string; // optional display, e.g. "10 g", "105 mg"
};

export type Product = {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  score: number; // 0–100
  level: "bad" | "poor" | "good" | "excellent";
  negativeIngredients: IngredientRisk[];
  positiveIngredients: IngredientRisk[];
};
