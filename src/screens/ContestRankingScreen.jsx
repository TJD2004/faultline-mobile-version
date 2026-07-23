import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Crown } from "lucide-react-native";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function ContestRankingScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const [ranking, setRanking] = useState(null);

  useEffect(() => {
    api.get("/contests/ranking/global").then(({ data }) => setRanking(data.ranking));
  }, []);

  return (
    <View style={styles.screen}>
      <View style={{ padding: 16, paddingBottom: 8 }}>
        <Text style={styles.title}>Contest Ranking</Text>
        <Text style={styles.subtitle}>Rating from contest submissions only — separate from Practice XP.</Text>
      </View>
      <FlatList
        data={ranking || []}
        keyExtractor={(r) => String(r.id)}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <View style={[styles.row, item.id === user?.id && styles.rowMe]}>
            <View style={styles.rankBox}>
              {item.rank <= 3 ? (
                <Crown size={16} color={["#FBBF24", "#C0C0D0", "#B08D57"][item.rank - 1]} />
              ) : (
                <Text style={styles.rankText}>{item.rank}</Text>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name} numberOfLines={1}>{item.name}{item.id === user?.id ? " (you)" : ""}</Text>
              <Text style={styles.subName}>{item.contests_participated} contest(s) · {item.total_contest_solves} solves</Text>
            </View>
            <Text style={styles.xp}>{item.total_contest_xp} XP</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.muted}>No contest submissions yet.</Text>}
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
    row: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
    rowMe: { backgroundColor: `${colors.violet}14` },
    rankBox: { width: 24, alignItems: "center" },
    rankText: { color: colors.muted, fontSize: 13, fontFamily: "Courier" },
    name: { color: colors.text, fontSize: 13, fontWeight: "500" },
    subName: { color: colors.muted, fontSize: 11, marginTop: 1 },
    xp: { color: colors.text, fontSize: 12, fontFamily: "Courier" },
  });
