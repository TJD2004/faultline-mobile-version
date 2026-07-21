import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { CheckCircle2 } from "lucide-react-native";
import api from "../api/axios";
import { colors } from "../theme";
import Card from "../components/Card";
import Pill from "../components/Pill";

export default function SubmissionsScreen() {
  const [submissions, setSubmissions] = useState(null);

  useEffect(() => {
    api.get("/submissions").then(({ data }) => setSubmissions(data.submissions));
  }, []);

  return (
    <View style={styles.screen}>
      <View style={{ padding: 16, paddingBottom: 8 }}>
        <Text style={styles.title}>Submissions</Text>
        <Text style={styles.subtitle}>
          {submissions ? `${submissions.length} submission${submissions.length !== 1 ? "s" : ""}` : "Loading…"}
        </Text>
      </View>
      <FlatList
        data={submissions || []}
        keyExtractor={(s) => String(s.id)}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        renderItem={({ item }) => (
          <Card style={styles.row}>
            <CheckCircle2 size={16} color={colors.success} />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle} numberOfLines={1}>{item.title}</Text>
              <View style={styles.metaRow}>
                <Pill color={colors.cyan}>{item.lang}</Pill>
                {!!item.used_solution && <Pill color={colors.warn}>Solution used</Pill>}
                <Text style={styles.metaText}>{item.attempts} attempt(s)</Text>
              </View>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.xpText}>+{item.xp_earned} XP</Text>
              <Text style={styles.dateText}>{new Date(item.created_at).toLocaleDateString()}</Text>
            </View>
          </Card>
        )}
        ListEmptyComponent={<Text style={styles.muted}>No submissions yet — solve a challenge and submit it.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.void },
  title: { color: colors.text, fontSize: 20, fontWeight: "700" },
  subtitle: { color: colors.muted, fontSize: 12, marginTop: 2 },
  muted: { color: colors.muted, fontSize: 13, padding: 16 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  rowTitle: { color: colors.text, fontSize: 13, fontWeight: "500" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6, flexWrap: "wrap" },
  metaText: { color: "#5C5C70", fontSize: 10, fontFamily: "Courier" },
  xpText: { color: colors.violet, fontSize: 12, fontFamily: "Courier" },
  dateText: { color: "#5C5C70", fontSize: 10, marginTop: 2 },
});
