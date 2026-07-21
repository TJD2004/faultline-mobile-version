import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { Clock, Trophy } from "lucide-react-native";
import api from "../api/axios";
import { colors } from "../theme";
import Card from "../components/Card";

const STATUS_STYLE = {
  active: { color: colors.success, label: "Active now" },
  upcoming: { color: colors.warn, label: "Upcoming" },
  ended: { color: colors.muted, label: "Ended" },
};

export default function ContestListScreen({ navigation }) {
  const [contests, setContests] = useState(null);

  useEffect(() => {
    api.get("/contests").then(({ data }) => setContests(data.contests));
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Contest</Text>
          <Text style={styles.subtitle}>8 challenges, 1 hour, every Saturday 7 PM.</Text>
        </View>
        <Pressable onPress={() => navigation.navigate("ContestRanking")} style={styles.rankingBtn}>
          <Trophy size={13} color={colors.violet} />
          <Text style={styles.rankingBtnText}>Ranking</Text>
        </Pressable>
      </View>

      <FlatList
        data={contests || []}
        keyExtractor={(c) => c.slug}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        renderItem={({ item }) => {
          const style = STATUS_STYLE[item.status] || STATUS_STYLE.ended;
          return (
            <Pressable onPress={() => navigation.navigate("ContestDetail", { slug: item.slug })}>
              <Card>
                <View style={styles.cardTop}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <View style={[styles.statusPill, { borderColor: `${style.color}66`, backgroundColor: `${style.color}22` }]}>
                    <Text style={[styles.statusText, { color: style.color }]}>{style.label}</Text>
                  </View>
                </View>
                <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
                <View style={styles.timeRow}>
                  <Clock size={11} color={colors.muted} />
                  <Text style={styles.timeText}>{new Date(item.start_time).toLocaleString()}</Text>
                </View>
              </Card>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.void },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", padding: 16, paddingBottom: 4 },
  title: { color: colors.text, fontSize: 20, fontWeight: "700" },
  subtitle: { color: colors.muted, fontSize: 12, marginTop: 2 },
  rankingBtn: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: `${colors.violet}22`, borderWidth: 1, borderColor: `${colors.violet}55`, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  rankingBtnText: { color: colors.violet, fontSize: 11, fontWeight: "600" },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  cardTitle: { color: colors.text, fontSize: 15, fontWeight: "700", flex: 1, marginRight: 8 },
  statusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, borderWidth: 1 },
  statusText: { fontSize: 10, fontFamily: "Courier" },
  cardDesc: { color: colors.muted, fontSize: 12, marginBottom: 8 },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  timeText: { color: colors.muted, fontSize: 11, fontFamily: "Courier" },
});
