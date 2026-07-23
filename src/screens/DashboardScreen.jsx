import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet, RefreshControl, Pressable } from "react-native";
import { Flame, Coins, Bug, CheckCircle2, ChevronRight } from "lucide-react-native";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { titleForXp, levelInfo } from "../utils/gamification";
import { useTheme } from "../context/ThemeContext";
import Card from "../components/Card";
import Pill from "../components/Pill";

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();
  const { colors } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const [challenges, setChallenges] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(() => {
    api.get("/challenges").then(({ data }) => setChallenges(data.challenges));
    api.get("/submissions").then(({ data }) => setSubmissions(data.submissions));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const solvedSet = new Set(submissions.map((s) => s.slug));
  const { level, xpIntoLevel, xpForNext } = levelInfo(user?.xp ?? 0);
  const pct = Math.min(100, Math.round((xpIntoLevel / xpForNext) * 100));

  const recommended = [...challenges].sort((a, b) => solvedSet.has(a.slug) - solvedSet.has(b.slug)).slice(0, 5);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.violet} />}
    >
      <Text style={styles.greeting}>Welcome back, {user?.name}</Text>
      <Text style={styles.subGreeting}>
        {titleForXp(user?.xp)} · {user?.streak ?? 0} day streak
      </Text>

      <Card style={{ marginTop: 16 }}>
        <View style={styles.xpRow}>
          <Text style={styles.xpLabel}>Level {level}</Text>
          <Text style={styles.xpLabel}>{xpIntoLevel} / {xpForNext} XP</Text>
        </View>
        <View style={styles.xpBarTrack}>
          <View style={[styles.xpBarFill, { width: `${pct}%` }]} />
        </View>
        <View style={styles.statsRow}>
          <StatBox icon={<Bug size={16} color={colors.violet} />} value={submissions.length} label="Bugs fixed" colors={colors} />
          <StatBox icon={<Flame size={16} color={colors.warn} />} value={user?.streak ?? 0} label="Streak" colors={colors} />
          <StatBox icon={<Coins size={16} color={colors.warn} />} value={user?.coins ?? 0} label="Coins" colors={colors} />
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Recommended for you</Text>
      {recommended.map((c) => {
        const solved = solvedSet.has(c.slug);
        return (
          <Pressable key={c.slug} onPress={() => navigation.navigate("Challenge", { slug: c.slug })}>
            <Card style={styles.challengeRow}>
              <View style={styles.challengeIcon}>
                {solved ? <CheckCircle2 size={16} color={colors.success} /> : <Bug size={16} color={colors.violet} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.challengeTitle} numberOfLines={1}>{c.title}</Text>
                <View style={styles.pillRow}>
                  <Pill color={colors.cyan}>{c.lang}</Pill>
                  <Pill color={colors.muted}>{c.difficulty}</Pill>
                </View>
              </View>
              <ChevronRight size={16} color={colors.muted} />
            </Card>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function StatBox({ icon, value, label, colors }) {
  const styles = getStyles(colors);
  return (
    <View style={styles.statBox}>
      {icon}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.void },
    greeting: { color: colors.text, fontSize: 20, fontWeight: "700" },
    subGreeting: { color: colors.muted, fontSize: 13, marginTop: 2 },
    xpRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
    xpLabel: { color: colors.muted, fontSize: 11 },
    xpBarTrack: { height: 8, borderRadius: 4, backgroundColor: colors.surface2, overflow: "hidden" },
    xpBarFill: { height: 8, borderRadius: 4, backgroundColor: colors.violet },
    statsRow: { flexDirection: "row", gap: 10, marginTop: 14 },
    statBox: { flex: 1, backgroundColor: colors.surface2, borderRadius: 10, padding: 10 },
    statValue: { color: colors.text, fontSize: 16, fontWeight: "700", marginTop: 6 },
    statLabel: { color: colors.muted, fontSize: 10, marginTop: 2 },
    sectionTitle: { color: colors.text, fontSize: 14, fontWeight: "600", marginTop: 20, marginBottom: 10 },
    challengeRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8 },
    challengeIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: `${colors.violet}22`, alignItems: "center", justifyContent: "center" },
    challengeTitle: { color: colors.text, fontSize: 13, fontWeight: "500" },
    pillRow: { flexDirection: "row", gap: 6, marginTop: 6 },
  });
