import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { Flame, Coins, Bug, Award } from "lucide-react-native";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { titleForXp } from "../utils/gamification";
import { colors } from "../theme";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    api.get("/submissions").then(({ data }) => setSubmissions(data.submissions));
    api.get("/achievements").then(({ data }) => setAchievements(data.achievements)).catch(() => {});
  }, []);

  const unlocked = achievements.filter((a) => a.unlocked).length;

  const confirmLogout = () => {
    Alert.alert("Log out of Faultline?", "You'll need to log back in to continue practicing.", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() || "?"}</Text>
        </View>
        <View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <Text style={styles.rank}>{titleForXp(user?.xp)}</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <StatCard icon={<Bug size={16} color={colors.violet} />} value={submissions.length} label="Bugs fixed" />
        <StatCard icon={<Flame size={16} color={colors.warn} />} value={user?.streak ?? 0} label="Streak" />
        <StatCard icon={<Coins size={16} color={colors.warn} />} value={user?.coins ?? 0} label="Coins" />
        <StatCard icon={<Award size={16} color={colors.success} />} value={unlocked} label="Achievements" />
      </View>

      <View style={{ height: 20 }} />
      <PrimaryButton label="Log out" onPress={confirmLogout} variant="secondary" />
    </ScrollView>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <Card style={styles.statCard}>
      {icon}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.void },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 20 },
  avatar: { width: 56, height: 56, borderRadius: 16, backgroundColor: colors.violet, alignItems: "center", justifyContent: "center" },
  avatarText: { color: colors.void, fontSize: 20, fontWeight: "700" },
  name: { color: colors.text, fontSize: 18, fontWeight: "700" },
  email: { color: colors.muted, fontSize: 12, marginTop: 2 },
  rank: { color: colors.violet, fontSize: 12, marginTop: 2 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statCard: { width: "47%" },
  statValue: { color: colors.text, fontSize: 18, fontWeight: "700", marginTop: 8 },
  statLabel: { color: colors.muted, fontSize: 11, marginTop: 2 },
});
