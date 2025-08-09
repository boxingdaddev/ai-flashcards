import React from "react";
import { View, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

type Props = {
  children: React.ReactNode;
  backgroundColor?: string;
  edges?: Array<"top" | "right" | "bottom" | "left">;
  barStyle?: "light-content" | "dark-content";
};

export default function AppScreen({
  children,
  backgroundColor,
  edges = ["top", "right", "bottom", "left"],
  barStyle,
}: Props) {
  const scheme = useColorScheme() ?? "light";
  const BG =
    backgroundColor ??
    (scheme === "dark" ? Colors.dark.background : Colors.light.background);
  const SAFE = scheme === "dark" ? Colors.dark.safeArea : Colors.light.safeArea;

  const computedBarStyle =
    barStyle ?? (scheme === "dark" ? "light-content" : "dark-content");

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <StatusBar translucent={false} backgroundColor={SAFE} barStyle={computedBarStyle} />
      <SafeAreaView style={{ flex: 1 }} edges={edges}>
        {children}
      </SafeAreaView>
    </View>
  );
}
