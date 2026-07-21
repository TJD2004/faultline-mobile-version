import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Crown } from "lucide-react-native";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme";

export default function LeaderboardScreen() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    api.get("/leaderboard").then(({ data }) => setLeaderboard(data.leaderboard));
  }, []);

  return (
    <View style={styles.screen}>
      <View style={{ padding: 16, paddingBottom: 8 }}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>Global rankings by total XP.</Text>
      </View>
      <FlatList
        data={leaderboard}
        keyExtractor={(u) => String(u.id)}
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
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.name?.[0]?.toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}{item.id === user?.id ? " (you)" : ""}
              </Text>
              <Text style={styles.subName}>{item.title}</Text>
            </View>
            <Text style={styles.xp}>{item.xp?.toLocaleString?.() ?? item.xp} XP</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.void },
  title: { color: colors.text, fontSize: 20, fontWeight: "700" },
  subtitle: { color: colors.muted, fontSize: 13, marginTop: 2 },
  row: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowMe: { backgroundColor: `${colors.violet}14` },
  rankBox: { width: 24, alignItems: "center" },
  rankText: { color: colors.muted, fontSize: 13, fontFamily: "Courier" },
  avatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.violet, alignItems: "center", justifyContent: "center" },
  avatarText: { color: colors.void, fontWeight: "700", fontSize: 12 },
  name: { color: colors.text, fontSize: 13, fontWeight: "500" },
  subName: { color: colors.muted, fontSize: 11, marginTop: 1 },
  xp: { color: colors.text, fontSize: 12, fontFamily: "Courier" },
});
