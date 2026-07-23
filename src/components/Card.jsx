import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function Card({ children, style }) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  return <View style={[styles.card, style]}>{children}</View>;
}

const getStyles = (colors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
    },
  });
