import { ProductFromApi, fetchProductByBarcode } from "../api/productsApi";

export async function getBetterProducts(
  scannedProduct: ProductFromApi,
): Promise<ProductFromApi[]> {
  try {
    const category = scannedProduct.categoryTags?.[0];

    if (!category) return [];

    const url =
      `https://world.openfoodfacts.org/cgi/search.pl?` +
      `search_simple=1&action=process&json=1&page_size=15&` +
      `tagtype_0=categories&tag_contains_0=contains&tag_0=${category}`;

    const response = await fetch(url);
    const data = await response.json();

    const products = data.products || [];

    const results = await Promise.all(
      products.slice(0, 5).map((p: any) => fetchProductByBarcode(p.code)),
    );

    const filtered = results.filter(
      (p): p is ProductFromApi =>
        p !== null &&
        p.score >= 50 && // only consider products with a decent score
        p.id !== scannedProduct.score + 10,
    );
    if (filtered.length === 0) return [];

    return filtered.sort((a, b) => b.score - a.score).slice(0, 5);
  } catch {
    return [];
  }
}
