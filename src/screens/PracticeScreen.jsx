import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable, ScrollView } from "react-native";
import { Star, Coins, CheckCircle2, Bookmark, BookmarkCheck } from "lucide-react-native";
import api from "../api/axios";
import { colors } from "../theme";
import Card from "../components/Card";
import Pill from "../components/Pill";

export default function PracticeScreen({ navigation }) {
  const [challenges, setChallenges] = useState([]);
  const [solvedSlugs, setSolvedSlugs] = useState(new Set());
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState(new Set());
  const [lang, setLang] = useState("All");
  const [diff, setDiff] = useState("All");

  useEffect(() => {
    api.get("/challenges").then(({ data }) => setChallenges(data.challenges));
    api.get("/submissions").then(({ data }) => setSolvedSlugs(new Set(data.submissions.map((s) => s.slug))));
    api.get("/bookmarks/slugs").then(({ data }) => setBookmarkedSlugs(new Set(data.slugs))).catch(() => {});
  }, []);

  const toggleBookmark = async (slug) => {
    const { data } = await api.post(`/bookmarks/${slug}/toggle`);
    setBookmarkedSlugs((prev) => {
      const next = new Set(prev);
      data.bookmarked ? next.add(slug) : next.delete(slug);
      return next;
    });
  };

  const langs = ["All", ...new Set(challenges.map((c) => c.lang))];
  const diffs = ["All", "Easy", "Medium", "Hard", "Expert"];
  const filtered = challenges.filter(
    (c) => (lang === "All" || c.lang === lang) && (diff === "All" || c.difficulty === diff)
  );

  return (
    <View style={styles.screen}>
      <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        <Text style={styles.title}>Practice</Text>
        <Text style={styles.subtitle}>Pick a bug. Read the report. Fix it for real.</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
        {langs.map((l) => (
          <Pressable key={l} onPress={() => setLang(l)} style={[styles.filterChip, lang === l && styles.filterChipActive]}>
            <Text style={[styles.filterChipText, lang === l && styles.filterChipTextActive]}>{l}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
        {diffs.map((d) => (
          <Pressable key={d} onPress={() => setDiff(d)} style={[styles.filterChip, diff === d && styles.filterChipActive]}>
            <Text style={[styles.filterChipText, diff === d && styles.filterChipTextActive]}>{d}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(c) => c.slug}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        renderItem={({ item }) => {
          const solved = solvedSlugs.has(item.slug);
          const bookmarked = bookmarkedSlugs.has(item.slug);
          return (
            <Pressable onPress={() => navigation.navigate("Challenge", { slug: item.slug })}>
              <Card style={solved ? { borderColor: `${colors.success}55` } : undefined}>
                <View style={styles.cardTopRow}>
                  <View style={styles.cardTop}>
                    <Pill color={colors.cyan}>{item.lang}</Pill>
                    <Pill color={colors.muted}>{item.difficulty}</Pill>
                  </View>
                  <Pressable onPress={() => toggleBookmark(item.slug)} hitSlop={8}>
                    {bookmarked ? <BookmarkCheck size={18} color={colors.warn} /> : <Bookmark size={18} color={colors.muted} />}
                  </Pressable>
                </View>
                <View style={styles.cardTitleRow}>
                  {solved && <CheckCircle2 size={14} color={colors.success} />}
                  <Text style={styles.cardTitle}>{item.title}</Text>
                </View>
                <View style={styles.cardMetaRow}>
                  <View style={styles.metaItem}>
                    <Star size={12} color={colors.warn} />
                    <Text style={styles.metaText}>{item.xp} XP</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Coins size={12} color={colors.warn} />
                    <Text style={styles.metaText}>{item.coins}</Text>
                  </View>
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
  title: { color: colors.text, fontSize: 20, fontWeight: "700" },
  subtitle: { color: colors.muted, fontSize: 13, marginTop: 2, marginBottom: 10 },
  filterRow: { flexGrow: 0, marginBottom: 8 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border },
  filterChipActive: { backgroundColor: colors.violet, borderColor: colors.violet },
  filterChipText: { color: colors.muted, fontSize: 12, fontFamily: "Courier" },
  filterChipTextActive: { color: "#fff" },
  cardTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  cardTop: { flexDirection: "row", gap: 8 },
  cardTitleRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 },
  cardTitle: { color: colors.text, fontSize: 14, fontWeight: "500", flex: 1 },
  cardMetaRow: { flexDirection: "row", gap: 16 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { color: colors.muted, fontSize: 11, fontFamily: "Courier" },
});
