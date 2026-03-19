const BASE_URL = "https://world.openfoodfacts.org/api/v0/product";

export type ProductFromApi = {
  id: string; // Open Food Facts ID or barcode
  name: string;
  brand: string;
  score: number; // calculated from nutriscore and additives
  level: "bad" | "poor" | "good" | "excellent";
  barcode?: string;
  nutriScore?: string;
  ingredientsText?: string;
  additivesTags?: string[];
  allergensTags?: string[];
  labelsTags?: string[];
  categoryTags?: string[]; // optional categories from API
  nutriments?: Record<string, number | undefined>;
  imageUrl?: string;
};

// Convert nutriscore grade to a base score
function nutriscoreToPoints(grade?: string): number {
  switch (grade?.toLowerCase()) {
    case "a":
      return 90;
    case "b":
      return 75;
    case "c":
      return 55;
    case "d":
      return 35;
    case "e":
      return 15;
    default:
      return 50; // unknown — neutral
  }
}
// Main function to fetch product data and calculate 0-100 score from row API data
function calculateScore(p: Record<string, any>): number {
  let score = nutriscoreToPoints(p.nutriscore_grade);

  // Penalise high additives count
  const additiveCount = (p.additives_tags ?? []).length;
  if (additiveCount >= 5) score -= 20;
  else if (additiveCount >= 2) score -= 10;

  // Penalise high sugar
  const sugars = p.nutriments?.["sugars_100g"] as number | undefined;
  if (sugars !== undefined) {
    if (sugars >= 20) score -= 15;
    else if (sugars >= 10) score -= 7;
  }
  // Penalise high salt
  const salt = p.nutriments?.["salt_100g"] as number | undefined;
  if (salt !== undefined && salt >= 1.5) score -= 10;

  // fiber is good, reward it
  const fiber = p.nutriments?.["fiber_100g"] as number | undefined;
  if (fiber !== undefined && fiber >= 3) score += 5;

  // Reward organic label
  if ((p.labels_tags ?? []).includes("en:organic")) score += 5;

  return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreToLevel(score: number): ProductFromApi["level"] {
  if (score >= 75) return "excellent";
  if (score >= 50) return "good";
  if (score >= 25) return "poor";
  return "bad";
}

const CANDIDATE_BARCODES: Record<string, string[]> = {
  waters: ["3274080005003", "5000107009638", "5010477348618"],
  "spring-waters": ["3274080005003", "5000107009638"],
  "unsweetened-beverages": ["3274080005003", "5000107009638", "5010477348618"],
  beverages: ["3274080005003", "5000107009638", "5010477348618"],
  sodas: ["3274080005003", "5000107009638"],
  "carbonated-drinks": ["3274080005003", "5000107009638"],
  "fruit-juices": ["5449000214911", "3057640385148"],
  juices: ["5449000214911", "3057640385148"],
  drinks: ["3274080005003", "5000107009638"],
  skyrs: ["3033490004743", "5391520032894"],
  "plain-skyrs": ["3033490004743", "5391520032894"],
  yogurts: ["3033490004743", "5391520032894"],
  "fermented-milk-products": ["3033490004743", "5391520032894"],
  dairy: ["3033490004743", "5391520032894"],
  milks: ["3033490004743", "5391520032894"],
  cheeses: ["3033490004743", "5391520032894"],
  pastas: ["8076800195057", "8076800376561"],
  spaghetti: ["8076800195057"],
  "dry-pastas": ["8076800195057", "8076800376561"],
  cereals: ["7300400481588", "5391520032894"],
  crispbreads: ["7300400481588"],
  "crispbreads-wholemeal": ["7300400481588"],
  breads: ["7300400481588", "5000112548953"],
  "whole-grain-breads": ["7300400481588"],
  oats: ["7300400481588"],
  rices: ["8076800195057"],
  snacks: ["7300400481588", "3033490004743"],
  biscuits: ["7300400481588", "3033490004743"],
  crackers: ["7300400481588"],
  cakes: ["7300400481588", "3033490004743"],
  chips: ["7300400481588", "3033490004743"],
  crisps: ["7300400481588"],
  chocolates: ["3033490004743", "7300400481588"],
  confectioneries: ["3033490004743", "7300400481588"],
  candies: ["3033490004743", "7300400481588"],
  "sweet-snacks": ["3033490004743", "7300400481588"],
  gummies: ["3033490004743", "7300400481588"],
  meats: ["3083681085188", "3250391660016"],
  "processed-meats": ["3083681085188", "3250391660016"],
  sausages: ["3083681085188", "3250391660016"],
  poultries: ["3083681085188", "3250391660016"],
  fishes: ["3250391660016", "3083681085188"],
  fish: ["3250391660016", "3083681085188"],
  seafoods: ["3250391660016", "3083681085188"],
  fruits: ["3274080005003", "3057640385148"],
  vegetables: ["3274080005003", "3033490004743"],
  legumes: ["3250391660016", "8076800195057"],
  beans: ["3250391660016", "8076800195057"],
  spreads: ["3033490004743", "7300400481588"],
  sauces: ["3033490004743", "3274080005003"],
  condiments: ["3033490004743", "3274080005003"],
  "frozen-foods": ["3033490004743", "8076800195057"],
  "ready-meals": ["3033490004743", "8076800195057"],
  breakfasts: ["7300400481588", "3033490004743"],
  "cereals-and-their-products": ["7300400481588", "8076800195057"],
  default: ["3274080005003", "8076800195057", "3033490004743", "7300400481588"],
};

function getCandidateBarcodes(
  categoryTags: string[],
  excludeId: string,
): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const tag of [...categoryTags].reverse()) {
    const key = tag.replace(/^[a-z]{2}:/, "").toLowerCase();
    const barcodes = CANDIDATE_BARCODES[key];
    if (barcodes) {
      for (const bc of barcodes) {
        if (bc !== excludeId && !seen.has(bc)) {
          seen.add(bc);
          result.push(bc);
        }
      }
    }
    if (result.length >= 5) break;
  }

  if (result.length === 0) {
    for (const bc of CANDIDATE_BARCODES["default"]) {
      if (bc !== excludeId) result.push(bc);
    }
  }
  return result;
}

// Fetches a single product by barcode from Open Food Facts
export async function fetchProductByBarcode(
  barcode: string,
): Promise<ProductFromApi | null> {
  try {
    const url = `${BASE_URL}/${barcode}.json`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 5s timeout
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) return null;

    const data = await response.json();

    // Check if product data is valid
    if (data.status !== 1 || !data.product) return null;

    const p = data.product;

    const score = calculateScore(p);
    return {
      id: barcode,
      name:
        p.product_name_en ||
        p.product_name ||
        p.abbreviated_product_name ||
        "Unknown Product",
      brand: p.brands || "Unknown Brand",
      categoryTags: p.categories_tags ?? [],
      imageUrl: p.image_front_url || p.image_url || undefined,
      ingredientsText: p.ingredients_text || p.ingredients_text_en || "",
      nutriments: p.nutriments ?? {},
      additivesTags: p.additives_tags ?? [],
      allergensTags: p.allergens_tags ?? [],
      labelsTags: p.labels_tags ?? [],
      score,
      level: scoreToLevel(score),
    };
  } catch {
    //console.error("Barcode failed:", error);
    return null;
  }
}

export async function fetchAlternative(
  scannedProduct: ProductFromApi,
): Promise<ProductFromApi | null> {
  try {
    // No need for alternative if product already scores high
    if (scannedProduct.score >= 50) return null;

    // Use the first category tag from the scanned product
    const categoryTag = scannedProduct.categoryTags ?? [];
    const barcodes = getCandidateBarcodes(categoryTag, scannedProduct.id);

    if (barcodes.length === 0) return null;

    const result = await Promise.all(
      barcodes.map((bc) => fetchProductByBarcode(bc)),
    );
    let bestCandidate: ProductFromApi | null = null;
    for (const candidate of result) {
      if (!candidate) continue;
      if (candidate.score <= 50) continue; // must be better than 50
      if (!bestCandidate || candidate.score > bestCandidate.score) {
        bestCandidate = candidate;
      }
    }
    return bestCandidate;
  } catch {
    // console.error("Alternative fetch failed:", error);
    return null;
  }
}
