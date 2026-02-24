import { StyleSheet } from "react-native";

export const recommendationsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#72D8CF",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  // row that holds two cards
  pairRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  // each product card
  card: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 4,
  },
  cardLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  cardName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  cardScore: {
    fontSize: 14,
    color: "#16a34a",
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
