import { StyleSheet } from "react-native";

export const scanStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#72D8CF",
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: 14,
    marginTop: 4,
  },
  cameraBox: {
    flex: 1.2,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  resultCard: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#FFF7D6",
    marginBottom: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  resultLabel: {
    color: "#6b7280",
    fontSize: 13,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  productName: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  scoreLabel: {
    color: "#4ade80",
    fontSize: 16,
    marginBottom: 8,
  },
  resultMessage: {
    color: "#4b5563",
    fontSize: 13,
    marginBottom: 8,
  },
});
