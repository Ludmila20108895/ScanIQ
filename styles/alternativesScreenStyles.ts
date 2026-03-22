import { StyleSheet } from "react-native";

export const alternativesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#72D8CF",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 12,
  },
  // no alternative — same as history/recommendations will showempty state
  emptyCard: {
    backgroundColor: "#FFF7D6",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },

  // alternative card gets a green left border
  altCard: {
    backgroundColor: "#FFF7D6",
    borderRadius: 22,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },

  // product image
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 14,
    backgroundColor: "#f9fafb",
  },
  productImagePlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#e8e8e8",
  },

  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 10,
  },

  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  levelDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 6,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: "600",
  },
  levelLabel: {
    fontSize: 15,
    fontWeight: "600",
    marginRight: 8,
  },
});
