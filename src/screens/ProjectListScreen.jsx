import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { FolderGit2, Star, Coins, ChevronRight } from "lucide-react-native";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import Card from "../components/Card";
import Pill from "../components/Pill";

export default function ProjectListScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    api.get("/projects").then(({ data }) => setProjects(data.projects));
  }, []);

  return (
    <View style={styles.screen}>
      <View style={{ padding: 16, paddingBottom: 8 }}>
        <Text style={styles.title}>Project Mode</Text>
        <Text style={styles.subtitle}>Navigate a full multi-file project and fix a real bug.</Text>
      </View>
      <FlatList
        data={projects || []}
        keyExtractor={(p) => p.slug}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate("ProjectDetail", { slug: item.slug })}>
            <Card style={styles.row}>
              <View style={styles.iconBox}>
                <FolderGit2 size={18} color={colors.violet} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle} numberOfLines={1}>{item.title}</Text>
                <View style={styles.metaRow}>
                  <Pill color={colors.cyan}>{item.lang}</Pill>
                  <Pill color={colors.muted}>{item.difficulty}</Pill>
                  <View style={styles.metaItem}>
                    <Star size={11} color={colors.warn} />
                    <Text style={styles.metaText}>{item.xp}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Coins size={11} color={colors.warn} />
                    <Text style={styles.metaText}>{item.coins}</Text>
                  </View>
                </View>
              </View>
              <ChevronRight size={16} color={colors.muted} />
            </Card>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.muted}>No projects available yet.</Text>}
      />
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.void },
    title: { color: colors.text, fontSize: 20, fontWeight: "700" },
    subtitle: { color: colors.muted, fontSize: 12, marginTop: 2 },
    muted: { color: colors.muted, fontSize: 13, padding: 16 },
    row: { flexDirection: "row", alignItems: "center", gap: 12 },
    iconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: `${colors.violet}22`, alignItems: "center", justifyContent: "center" },
    rowTitle: { color: colors.text, fontSize: 13, fontWeight: "500" },
    metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6, flexWrap: "wrap" },
    metaItem: { flexDirection: "row", alignItems: "center", gap: 3 },
    metaText: { color: colors.warn, fontSize: 11, fontFamily: "Courier" },
  });
