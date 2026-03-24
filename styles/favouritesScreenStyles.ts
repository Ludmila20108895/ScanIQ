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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  selectedCard: {
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#10b981",
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    marginLeft: 12,
    borderColor: "#9ca3af",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteBar: {
    backgroundColor: "#ef4444",
    padding: 16,
    alignItems: "center",
  },

  deleteText: {
    color: "white",
    fontWeight: "700",
  },

  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 3,
    backgroundColor: "#ef4444",
  },
  colourDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 12,
    marginTop: 10,
  },
});
