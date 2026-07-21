import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Award, Lock, CheckCircle2 } from "lucide-react-native";
import api from "../api/axios";
import { colors } from "../theme";
import Card from "../components/Card";

export default function AchievementsScreen() {
  const [achievements, setAchievements] = useState(null);

  useEffect(() => {
    api.get("/achievements").then(({ data }) => setAchievements(data.achievements));
  }, []);

  const unlocked = achievements?.filter((a) => a.unlocked).length ?? 0;

  return (
    <View style={styles.screen}>
      <View style={{ padding: 16, paddingBottom: 8 }}>
        <Text style={styles.title}>Achievements</Text>
        <Text style={styles.subtitle}>{achievements ? `${unlocked} of ${achievements.length} unlocked` : "Loading…"}</Text>
      </View>
      <FlatList
        data={achievements || []}
        keyExtractor={(a) => a.slug}
        numColumns={2}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        columnWrapperStyle={{ gap: 10 }}
        renderItem={({ item }) => {
          const pct = Math.min(100, Math.round((item.progress / item.threshold) * 100));
          return (
            <Card style={[styles.card, { opacity: item.unlocked ? 1 : 0.55 }]}>
              <View style={styles.cardTop}>
                <View style={[styles.iconBox, item.unlocked && { backgroundColor: colors.violet }]}>
                  <Award size={16} color={item.unlocked ? colors.void : colors.muted} />
                </View>
                {item.unlocked ? <CheckCircle2 size={14} color={colors.success} /> : <Lock size={12} color={colors.muted} />}
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${pct}%` }]} />
              </View>
              <Text style={styles.progressText}>{item.progress} / {item.threshold}</Text>
            </Card>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.void },
  title: { color: colors.text, fontSize: 20, fontWeight: "700" },
  subtitle: { color: colors.muted, fontSize: 12, marginTop: 2 },
  card: { flex: 1 },
  cardTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  iconBox: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.surface2, alignItems: "center", justifyContent: "center" },
  cardTitle: { color: colors.text, fontSize: 12, fontWeight: "700", marginBottom: 2 },
  cardDesc: { color: colors.muted, fontSize: 10, marginBottom: 8 },
  progressTrack: { height: 5, borderRadius: 3, backgroundColor: colors.surface2, overflow: "hidden" },
  progressFill: { height: 5, borderRadius: 3, backgroundColor: colors.violet },
  progressText: { color: "#5C5C70", fontSize: 9, marginTop: 4, fontFamily: "Courier" },
});
