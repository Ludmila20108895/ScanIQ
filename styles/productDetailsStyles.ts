import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#72D8CF",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#72D8CF",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  error: {
    fontSize: 16,
    color: "#111827",
    marginBottom: 12,
    textAlign: "center",
  },
  backButton: {
    backgroundColor: "#f97316",
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButtonText: {
    color: "white",
    fontWeight: "600",
  },
  nutrientRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  nutrientCard: {
    backgroundColor: "white",
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    width: "48%",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  nutrientLabel: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 4,
  },
  nutrientValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  productCard: {
    backgroundColor: "#FFF7D6",
    borderRadius: 22,
    padding: 18,
    paddingRight: 48, // extra space for heart button
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    position: "relative",
  },
  productHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productTextBlock: {
    flex: 1,
    paddingRight: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
    color: "#111827",
  },
  brand: {
    fontSize: 15,
    color: "#6b7280",
  },
  scoreBlock: {
    alignItems: "flex-end",
  },
  levelDot: {
    width: 20,
    height: 20,
    borderRadius: 7,
    marginBottom: 4,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  levelText: {
    fontSize: 14,
    color: "#4b5563",
  },

  favRow: {
    marginTop: 8,
    marginBottom: 16,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#FFF7D6",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  favText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ef4444",
    marginRight: 8,
  },
  favHeart: {
    fontSize: 20,
    color: "#ef4444",
  },
  favHeartActive: {
    color: "#b91c1c",
  },

  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    color: "#111827",
  },
  sectionLine: {
    fontSize: 14,
    color: "#374151",
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  riskDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
  },
  ingredientTextContainer: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
  },
  ingredientSubtitle: {
    fontSize: 13,
    color: "#6b7280",
  },
});
