const BASE_URL = "https://world.openfoodfacts.org";

export type ProductFromApi = {
  id: string;
  name: string;
  brand: string;
  score: number;
  level: "bad" | "poor" | "good" | "excellent";
  barcode?: string;
  nutriScore?: string;
  ingredientsText?: string;
  additivesTags?: string[];
  nutriments?: any;
  imageUrl?: string;
};

export async function fetchProductByBarcode(
  barcode: string,
): Promise<ProductFromApi | null> {
  console.log("Calling API with barcode:", barcode);

  const res = await fetch(
    `${BASE_URL}/api/v0/product/${encodeURIComponent(barcode)}.json`,
  );

  console.log("API status:", res.status);

  if (!res.ok) {
    throw new Error("[network error]");
  }

  const json = await res.json();
  console.log("API JSON:", json);

  // Open Food Facts returns { status, product: {...}}
  if (json.status !== 1 || !json.product) {
    return null;
  }

  const p = json.product;
  const nutriments = p.nutriments ?? {};

  // will derive a rough score from nutriscore_grade (a=best, e=worst)
  const nutri = (p["nutriscore_grade"] as string | undefined)?.toLowerCase();
  const nutriToBaseScore: Record<string, number> = {
    a: 90,
    b: 80,
    c: 65,
    d: 45,
    e: 25,
  };
  let score = nutri ? (nutriToBaseScore[nutri] ?? 60) : 60;

  // Adjusted based on nutrients per 100g ---
  const sugars = nutriments["sugars_100g"] as number | undefined;
  const satFat = nutriments["saturated-fat_100g"] as number | undefined;
  const salt = nutriments["salt_100g"] as number | undefined;
  const fiber = nutriments["fiber_100g"] as number | undefined;

  // sugar  (approx:  guidance)
  if (sugars !== undefined) {
    if (sugars >= 20) score -= 15;
    else if (sugars >= 10) score -= 8;
    else if (sugars >= 5) score -= 3;
  }

  // saturated fat
  if (satFat !== undefined) {
    if (satFat >= 10) score -= 15;
    else if (satFat >= 5) score -= 8;
    else if (satFat >= 2) score -= 3;
  }

  // salt
  if (salt !== undefined) {
    if (salt >= 1.5) score -= 10;
    else if (salt >= 0.9) score -= 6;
    else if (salt >= 0.3) score -= 3;
  }

  // fiber bonus
  if (fiber !== undefined) {
    if (fiber >= 6) score += 8;
    else if (fiber >= 3) score += 4;
  }

  // clamp to 0–100
  if (score < 0) score = 0;
  if (score > 100) score = 100;

  let level: "bad" | "poor" | "good" | "excellent" = "good";
  if (score < 40) level = "bad";
  else if (score < 60) level = "poor";
  else if (score < 80) level = "good";
  else level = "excellent";

  return {
    id: p.id?.toString() ?? p.code,
    name: p.product_name ?? "Unknown product",
    brand: (p.brands ?? "").split(",")[0] || "Unknown brand",
    score,
    level,
    barcode: p.code,
    nutriScore: nutri,
    ingredientsText: p.ingredients_text,
    additivesTags: p.additives_tags ?? [],
    nutriments: p.nutriments ?? {},
    imageUrl: p.image_front_url,
  };
}
