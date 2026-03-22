import { getBetterProducts } from "../logic/recommendations";
import { calculateScore } from "../logic/scoring";

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

function scoreToLevel(score: number): ProductFromApi["level"] {
  if (score >= 75) return "excellent";
  if (score >= 50) return "good";
  if (score >= 25) return "poor";
  return "bad";
}

// Fetches a single product by barcode from Open Food Facts
export async function fetchProductByBarcode(
  barcode: string,
): Promise<ProductFromApi | null> {
  try {
    const response = await fetch(`${BASE_URL}/${barcode}.json`);
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

// Returns a list of 2–10 healthier alternatives for a scanned product, based on its category tags.
// Only called when scanned product scores below 50
// Returns empty array if nothing found
export async function fetchAlternatives(
  scannedProduct: ProductFromApi,
): Promise<ProductFromApi[]> {
  try {
    return await getBetterProducts(scannedProduct);
  } catch {
    return [];
  }
}

export async function fetchAlternative(
  scannedProduct: ProductFromApi,
): Promise<ProductFromApi | null> {
  const list = await fetchAlternatives(scannedProduct);
  return list.length > 0 ? list[0] : null;
}
