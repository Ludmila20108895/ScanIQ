import React from "react";
import ScanScreen, { Navigation } from "../screens/ScanScreen";

export default function Home() {
  const dummyNavigation: Navigation = {
    navigate: (_screen: string) => {},
  };

  return <ScanScreen navigation={dummyNavigation} />;
}
