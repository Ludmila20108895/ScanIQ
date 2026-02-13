const BASE_URL = "https://your-api-here.com";

export type ProductFromApi = {
  id: string;
  name: string;
  brand: string;
  score: number;
  level: "bad" | "poor" | "good" | "excellent";
};

export async function fetchProductByBarcode(
  barcode: string,
): Promise<ProductFromApi> {
  const res = await fetch(`${BASE_URL}/products/${barcode}`);
  if (!res.ok) {
    throw new Error("Product not found");
  }
  return res.json();
}
