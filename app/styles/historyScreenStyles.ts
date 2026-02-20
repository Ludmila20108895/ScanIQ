import { StyleSheet } from "react-native";

export const historyStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#72D8CF",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  row: {
    flexDirection: "row",
    borderRadius: 12,
    backgroundColor: "#f9fafb",
    marginBottom: 8,
    overflow: "hidden",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  colourDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 12,
    marginTop: 10,
  },
  rowContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  rowName: { fontSize: 16, fontWeight: "600", color: "#111827" },
  rowScore: { fontSize: 16, color: "#6b5563" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: { color: "#6b7280", fontSize: 16 },
});
