import { StyleSheet } from "react-native";

export const favouritesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#72D8CF",
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  empty: {
    fontSize: 16,
    color: "#4b5563",
    textAlign: "center",
    marginTop: 24,
  },
  itemCard: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#FFF7D6",
    marginBottom: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  productBrand: {
    color: "#6b7280",
  },
  scoreLabel: {
    marginTop: 8,
    color: "#111827",
  },
  resultMessage: {
    marginTop: 4,
    color: "#374151",
  },
});
