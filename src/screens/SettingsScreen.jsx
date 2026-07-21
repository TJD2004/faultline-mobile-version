import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Settings as SettingsIcon, Minus, Plus, RotateCcw } from "lucide-react-native";
import { useSettings } from "../context/SettingsContext";
import { colors } from "../theme";
import Card from "../components/Card";

export default function SettingsScreen() {
  const { settings, updateSetting, resetSettings } = useSettings();

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <SettingsIcon size={20} color={colors.violet} />
        <Text style={styles.title}>Settings</Text>
      </View>

      <Card style={{ marginTop: 16 }}>
        <Text style={styles.sectionTitle}>Code editor</Text>
        <Text style={styles.sectionSub}>Applies to Challenge and Project Mode screens.</Text>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Font size</Text>
          <View style={styles.stepper}>
            <Pressable
              onPress={() => updateSetting("editorFontSize", Math.max(11, settings.editorFontSize - 1))}
              style={styles.stepperBtn}
            >
              <Minus size={14} color={colors.text} />
            </Pressable>
            <Text style={styles.stepperValue}>{settings.editorFontSize}px</Text>
            <Pressable
              onPress={() => updateSetting("editorFontSize", Math.min(20, settings.editorFontSize + 1))}
              style={styles.stepperBtn}
            >
              <Plus size={14} color={colors.text} />
            </Pressable>
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowLabel}>Auto Save</Text>
            <Text style={styles.rowDesc}>Save your in-progress code as you type.</Text>
          </View>
          <Toggle checked={settings.autoSave} onChange={(v) => updateSetting("autoSave", v)} />
        </View>
      </Card>

      <Pressable onPress={resetSettings} style={styles.resetRow}>
        <RotateCcw size={13} color={colors.muted} />
        <Text style={styles.resetText}>Reset to defaults</Text>
      </Pressable>
    </View>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <Pressable onPress={() => onChange(!checked)} style={[styles.toggleTrack, checked && styles.toggleTrackOn]}>
      <View style={[styles.toggleThumb, checked && styles.toggleThumbOn]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.void, padding: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  title: { color: colors.text, fontSize: 20, fontWeight: "700" },
  sectionTitle: { color: colors.text, fontSize: 14, fontWeight: "600" },
  sectionSub: { color: colors.muted, fontSize: 11, marginTop: 2, marginBottom: 14 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border },
  rowLabel: { color: colors.text, fontSize: 13 },
  rowDesc: { color: colors.muted, fontSize: 11, marginTop: 2 },
  stepper: { flexDirection: "row", alignItems: "center", gap: 10 },
  stepperBtn: { width: 28, height: 28, borderRadius: 8, backgroundColor: colors.surface2, alignItems: "center", justifyContent: "center" },
  stepperValue: { color: colors.text, fontSize: 12, fontFamily: "Courier", minWidth: 32, textAlign: "center" },
  toggleTrack: { width: 44, height: 24, borderRadius: 12, backgroundColor: colors.surface2, justifyContent: "center", padding: 2 },
  toggleTrackOn: { backgroundColor: colors.violet },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: "#fff", alignSelf: "flex-start" },
  toggleThumbOn: { alignSelf: "flex-end" },
  resetRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 16, alignSelf: "center" },
  resetText: { color: colors.muted, fontSize: 12 },
});
