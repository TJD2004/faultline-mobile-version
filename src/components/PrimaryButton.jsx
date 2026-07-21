import React from "react";
import { Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors } from "../theme";

export default function PrimaryButton({ label, onPress, disabled, loading, variant = "primary" }) {
  const isPrimary = variant === "primary";
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        (disabled || loading) && styles.disabled,
        pressed && !disabled && { opacity: 0.85 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? "#fff" : colors.text} />
      ) : (
        <Text style={[styles.label, { color: isPrimary ? "#fff" : colors.text }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: colors.violet,
  },
  secondary: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
});
