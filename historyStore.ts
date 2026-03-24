import AsyncStorage from "@react-native-async-storage/async-storage"; // For persistent storage of history items
import { Product } from "./types/product";

export type HistoryItem = {
  id: string; // same as product ID
  product: Product;
  score: number;
  scannedAt: number; // timestamp
  alternative?: Product; // optional recommended
};

const HISTORY_KEY = "scaniq_history";

export async function getHistory(): Promise<HistoryItem[]> {
  try {
    const stored = await AsyncStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export async function addToHistory(
  product: Product,
  alternative?: Product,
): Promise<void> {
  try {
    const currentHistory = await getHistory();
    const filteredHistory = currentHistory.filter((h) => h.id !== product.id);
    const newItem: HistoryItem = {
      id: product.id,
      product,
      scannedAt: Date.now(),
      score: product.score,
      alternative,
    };
    const updatedHistory = [newItem, ...filteredHistory];
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch {}
}

export async function removeFromHistory(id: string): Promise<void> {
  try {
    const currentHistory = await getHistory();
    const updatedHistory = currentHistory.filter((h) => h.id !== id);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch {}
}

export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch {}
}

export async function getHistoryItemById(
  id: string,
): Promise<HistoryItem | null> {
  const history = await getHistory();
  return history.find((h) => h.id === id) ?? null;
}
export async function deleteHistoryItems(ids: string[]) {
  const current = await getHistory();
  const updated = current.filter((item) => !ids.includes(item.id));

  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}
