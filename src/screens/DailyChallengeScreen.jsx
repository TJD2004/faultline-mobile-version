import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Flame, Zap, CheckCircle2 } from "lucide-react-native";
import api from "../api/axios";
import { colors } from "../theme";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";

export default function DailyChallengeScreen({ navigation }) {
  const [daily, setDaily] = useState(undefined);

  useEffect(() => {
    api.get("/daily/today").then(({ data }) => setDaily(data.daily));
  }, []);

  return (
    <View style={styles.screen}>
      <View style={{ padding: 16 }}>
        <Text style={styles.title}>Daily Challenge</Text>
        <Text style={styles.subtitle}>One fresh bug every 24 hours, with bonus XP today.</Text>

        {daily === undefined && <Text style={styles.muted}>Loading…</Text>}
        {daily === null && (
          <Card>
            <Text style={styles.muted}>No daily challenge scheduled for today yet.</Text>
          </Card>
        )}
        {daily && (
          <Card>
            <Text style={styles.dailyTitle}>{daily.title}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>{daily.lang} · {daily.xp} XP base</Text>
              <View style={styles.bonusRow}>
                <Zap size={12} color={colors.success} />
                <Text style={styles.bonusText}>{Number(daily.bonus_multiplier)}× today</Text>
              </View>
            </View>
            {daily.completedToday ? (
              <View style={styles.doneRow}>
                <CheckCircle2 size={16} color={colors.success} />
                <Text style={styles.doneText}>Already solved today — nice work.</Text>
              </View>
            ) : (
              <PrimaryButton label="Solve today's challenge" onPress={() => navigation.navigate("Challenge", { slug: daily.slug })} />
            )}
          </Card>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.void },
  title: { color: colors.text, fontSize: 20, fontWeight: "700" },
  subtitle: { color: colors.muted, fontSize: 13, marginTop: 2, marginBottom: 16 },
  muted: { color: colors.muted, fontSize: 13 },
  dailyTitle: { color: colors.text, fontSize: 16, fontWeight: "700", marginBottom: 10 },
  metaRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  metaText: { color: colors.muted, fontSize: 12, fontFamily: "Courier" },
  bonusRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  bonusText: { color: colors.success, fontSize: 12, fontFamily: "Courier" },
  doneRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  doneText: { color: colors.success, fontSize: 13 },
});
