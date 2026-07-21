import React, { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Bookmark, BookmarkX, Star, Coins } from "lucide-react-native";
import api from "../api/axios";
import { colors } from "../theme";
import Card from "../components/Card";
import Pill from "../components/Pill";

export default function BookmarksScreen({ navigation }) {
  const [bookmarks, setBookmarks] = useState(null);

  const load = useCallback(() => {
    api.get("/bookmarks").then(({ data }) => setBookmarks(data.bookmarks));
  }, []);

  // Refetch whenever this screen regains focus, so removing a bookmark
  // elsewhere (or adding one from Practice) is always reflected here.
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const remove = async (slug) => {
    await api.post(`/bookmarks/${slug}/toggle`);
    setBookmarks((prev) => prev.filter((b) => b.slug !== slug));
  };

  return (
    <View style={styles.screen}>
      <View style={{ padding: 16, paddingBottom: 8 }}>
        <Text style={styles.title}>Bookmarks</Text>
        <Text style={styles.subtitle}>Challenges you saved to revisit later.</Text>
      </View>
      <FlatList
        data={bookmarks || []}
        keyExtractor={(b) => b.slug}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        renderItem={({ item }) => (
          <Card style={styles.row}>
            <Pressable style={{ flex: 1 }} onPress={() => navigation.navigate("Challenge", { slug: item.slug })}>
              <Text style={styles.rowTitle} numberOfLines={1}>{item.title}</Text>
              <View style={styles.metaRow}>
                <Pill color={colors.cyan}>{item.lang}</Pill>
                <Pill color={colors.muted}>{item.difficulty}</Pill>
                <View style={styles.metaItem}>
                  <Star size={11} color={colors.warn} />
                  <Text style={styles.metaText}>{item.xp}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Coins size={11} color={colors.warn} />
                  <Text style={styles.metaText}>{item.coins}</Text>
                </View>
              </View>
            </Pressable>
            <Pressable onPress={() => remove(item.slug)} hitSlop={8}>
              <BookmarkX size={18} color={colors.error} />
            </Pressable>
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Bookmark size={22} color="#5C5C70" />
            <Text style={styles.emptyText}>No bookmarks yet — tap the bookmark icon on any challenge in Practice.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.void },
  title: { color: colors.text, fontSize: 20, fontWeight: "700" },
  subtitle: { color: colors.muted, fontSize: 12, marginTop: 2 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  rowTitle: { color: colors.text, fontSize: 13, fontWeight: "500" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6, flexWrap: "wrap" },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 3 },
  metaText: { color: colors.warn, fontSize: 11, fontFamily: "Courier" },
  empty: { alignItems: "center", paddingVertical: 40, gap: 10, paddingHorizontal: 30 },
  emptyText: { color: colors.muted, fontSize: 12, textAlign: "center" },
});
