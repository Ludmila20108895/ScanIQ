import { StyleSheet } from "react-native";

export const recommendationsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#72D8CF",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },

  // row holding left + right card side by side
  pairRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 8,
  },

  // each card that takes equal space
  card: {
    flex: 1,
    backgroundColor: "#FFF7D6",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    // row so content sits left and chevron sits right
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  // left side of card: dot + text stacked
  cardInner: {
    flex: 1,
    flexDirection: "column",
  },

  // colour dot top of each card
  colourDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 6,
  },

  cardText: {
    flex: 1,
  },

  cardLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 3,
  },
  cardName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
    lineHeight: 17,
  },
  cardScore: {
    fontSize: 14,
    fontWeight: "700",
    // colour set inline per product level
  },

  // › chevron is on the right edge of card
  chevron: {
    fontSize: 20,
    color: "#6b7280",
    marginLeft: 4,
    alignSelf: "center",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#6b7280",
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
});
