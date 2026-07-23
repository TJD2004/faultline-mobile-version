import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Swords, Award, Bookmark, FolderGit2, Settings, ChevronRight, MoreHorizontal, Send } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";
import Card from "../components/Card";

const ITEMS = [
  { label: "Contest", icon: Swords, screen: "Contest" },
  { label: "Submissions", icon: Send, screen: "Submissions" },
  { label: "Achievements", icon: Award, screen: "Achievements" },
  { label: "Bookmarks", icon: Bookmark, screen: "Bookmarks" },
  { label: "Project Mode", icon: FolderGit2, screen: "Projects" },
  { label: "Settings", icon: Settings, screen: "Settings" },
];

export default function MoreScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.headerRow}>
        <MoreHorizontal size={20} color={colors.violet} />
        <Text style={styles.title}>More</Text>
      </View>

      <Card style={{ marginTop: 16, padding: 0, overflow: "hidden" }}>
        {ITEMS.map((item, i) => (
          <Pressable
            key={item.screen}
            onPress={() => navigation.navigate(item.screen)}
            style={[styles.row, i < ITEMS.length - 1 && styles.rowBorder]}
          >
            <item.icon size={18} color={colors.violet} />
            <Text style={styles.rowLabel}>{item.label}</Text>
            <ChevronRight size={16} color={colors.muted} />
          </Pressable>
        ))}
      </Card>
    </ScrollView>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.void },
    headerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    title: { color: colors.text, fontSize: 20, fontWeight: "700" },
    row: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
    rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
    rowLabel: { color: colors.text, fontSize: 14, flex: 1 },
  });
