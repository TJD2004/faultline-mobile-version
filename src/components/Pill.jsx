import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Pill({ children, color = "#7C6FFF" }) {
  return (
    <View style={[styles.pill, { borderColor: `${color}66`, backgroundColor: `${color}22` }]}>
      <Text style={[styles.text, { color }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 11,
    fontWeight: "600",
  },
});
