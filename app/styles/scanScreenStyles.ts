import { Dimensions, StyleSheet } from "react-native";

const { height } = Dimensions.get("window");
const CAMERA_HEIGHT = Math.min(260, height * 0.35);
const FRAME_HEIGHT = Math.min(160, height * 0.24);
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
    height: CAMERA_HEIGHT,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "black",
    marginBottom: 16,
    alignSelf: "center",
    width: "92%",
  },
  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#ffffff",
  },
  cameraDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)", // makes darker main camera
  },

  scanFrame: {
    width: "70%",
    height: FRAME_HEIGHT,
    alignSelf: "center",
    marginTop: 30,
  },
  corner: {
    position: "absolute",
    width: 26,
    height: 26,
    borderColor: "#ffffff",
    borderRadius: 2,
  },

  cornerTL: { top: 0, left: 0, borderLeftWidth: 2, borderTopWidth: 2 },
  cornerTR: { top: 0, right: 0, borderRightWidth: 2, borderTopWidth: 2 },
  cornerBL: { bottom: 0, left: 0, borderLeftWidth: 2, borderBottomWidth: 2 },
  cornerBR: { bottom: 0, right: 0, borderRightWidth: 2, borderBottomWidth: 2 },

  scanInner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    backgroundColor: "", // very light overlay
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
