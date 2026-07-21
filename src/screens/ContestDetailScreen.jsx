import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { CheckCircle2, ChevronRight, Crown } from "lucide-react-native";
import api from "../api/axios";
import { colors } from "../theme";
import Card from "../components/Card";
import Pill from "../components/Pill";

export default function ContestDetailScreen({ route, navigation }) {
  const { slug } = route.params;
  const [data, setData] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [tab, setTab] = useState("challenges");

  useEffect(() => {
    api.get(`/contests/${slug}`).then(({ data }) => setData(data));
    api.get(`/contests/${slug}/leaderboard`).then(({ data }) => setLeaderboard(data.leaderboard));
  }, [slug]);

  if (!data) {
    return (
      <View style={styles.screen}>
        <Text style={styles.muted}>Loading…</Text>
      </View>
    );
  }

  const { contest, challenges, completedSlugs } = data;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>{contest.title}</Text>
      <Text style={styles.subtitle}>{contest.description}</Text>

      <View style={styles.tabRow}>
        {["challenges", "leaderboard"].map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} style={[styles.tabBtn, tab === t && styles.tabBtnActive]}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t[0].toUpperCase() + t.slice(1)}</Text>
          </Pressable>
        ))}
      </View>

      {tab === "challenges" &&
        challenges.map((c) => {
          const done = completedSlugs.includes(c.slug);
          return (
            <Pressable key={c.slug} onPress={() => navigation.navigate("Challenge", { slug: c.slug })}>
              <Card style={styles.row}>
                {done ? <CheckCircle2 size={16} color={colors.success} /> : <View style={styles.emptyDot} />}
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle} numberOfLines={1}>{c.title}</Text>
                  <View style={{ flexDirection: "row", gap: 6, marginTop: 4 }}>
                    <Pill color={colors.cyan}>{c.lang}</Pill>
                    <Pill color={colors.muted}>{c.difficulty}</Pill>
                  </View>
                </View>
                <ChevronRight size={16} color={colors.muted} />
              </Card>
            </Pressable>
          );
        })}

      {tab === "leaderboard" && (
        <Card style={{ padding: 0, overflow: "hidden" }}>
          {leaderboard === null && <Text style={[styles.muted, { padding: 16 }]}>Loading…</Text>}
          {leaderboard?.length === 0 && <Text style={[styles.muted, { padding: 16 }]}>No submissions yet during this contest.</Text>}
          {leaderboard?.map((u, i) => (
            <View key={u.id} style={[styles.lbRow, i < leaderboard.length - 1 && styles.lbBorder]}>
              <View style={styles.rankBox}>
                {u.rank <= 3 ? <Crown size={14} color={["#FBBF24", "#C0C0D0", "#B08D57"][u.rank - 1]} /> : <Text style={styles.rankText}>{u.rank}</Text>}
              </View>
              <Text style={styles.lbName} numberOfLines={1}>{u.name}</Text>
              <Text style={styles.lbXp}>{u.contest_xp} XP</Text>
            </View>
          ))}
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.void, padding: 16 },
  muted: { color: colors.muted, fontSize: 13 },
  title: { color: colors.text, fontSize: 18, fontWeight: "700" },
  subtitle: { color: colors.muted, fontSize: 12, marginTop: 4, marginBottom: 14 },
  tabRow: { flexDirection: "row", backgroundColor: colors.surface2, borderRadius: 8, padding: 3, marginBottom: 12, alignSelf: "flex-start" },
  tabBtn: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 6 },
  tabBtnActive: { backgroundColor: colors.border },
  tabText: { color: colors.muted, fontSize: 12, fontWeight: "600" },
  tabTextActive: { color: colors.text },
  row: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  rowTitle: { color: colors.text, fontSize: 13, fontWeight: "500" },
  emptyDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  lbRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingVertical: 12 },
  lbBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rankBox: { width: 22, alignItems: "center" },
  rankText: { color: colors.muted, fontSize: 12, fontFamily: "Courier" },
  lbName: { color: colors.text, fontSize: 13, flex: 1 },
  lbXp: { color: colors.text, fontSize: 12, fontFamily: "Courier" },
});
