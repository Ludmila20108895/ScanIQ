export type HistoryItem = {
  id: string;
  name: string;
  score: number;
  level: "bad" | "poor" | "good" | "excellent";
};

let historyItems: HistoryItem[] = [];

export function addToHistory(item: HistoryItem) {
  // newest at top, avoid duplicates next to each other
  historyItems = [item, ...historyItems.filter((h) => h.id !== item.id)];
}

export function getHistory(): HistoryItem[] {
  return historyItems;
}

export function getHistoryItemById(id: string) {
  return historyItems.find((h) => h.id === id) ?? null;
}
