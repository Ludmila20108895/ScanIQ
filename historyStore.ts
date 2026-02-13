import { Product } from "./types/product";

export type HistoryItem = {
  id: string; // same as product ID
  product: Product;
  score: number;
  scannedAt: number; // timestamp
};

let historyItems: HistoryItem[] = [];

export function addToHistory(product: Product) {
  const existingIndex = historyItems.findIndex((h) => h.id === product.id);
  const newItem: HistoryItem = {
    id: product.id,
    product,
    scannedAt: Date.now(),
    score: product.score,
  };
  if (existingIndex !== -1) {
    historyItems.splice(existingIndex, 1); // remove existing entry to avoid duplicates
  }
  // newest at top, avoid duplicates next to each other
  historyItems = [newItem, ...historyItems];
}

export function getHistory(): HistoryItem[] {
  return historyItems;
}

export function getHistoryItemById(id: string): HistoryItem | null {
  const found = historyItems.find((h) => h.id === id);
  return found ?? null;
}
