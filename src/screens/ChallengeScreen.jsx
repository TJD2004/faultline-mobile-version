import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Play, Send, RotateCcw, Trophy, CheckCircle2, AlertTriangle, ChevronRight } from "lucide-react-native";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { colors } from "../theme";
import Card from "../components/Card";
import Pill from "../components/Pill";
import PrimaryButton from "../components/PrimaryButton";

const draftKey = (slug) => `faultline_draft_${slug}`;

export default function ChallengeScreen({ route, navigation }) {
  const { slug } = route.params;
  const { setUser } = useAuth();
  const { settings } = useSettings();
  const saveTimer = useRef(null);

  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState("");
  const [lines, setLines] = useState([]);
  const [status, setStatus] = useState("idle");
  const [attempts, setAttempts] = useState(0);
  const [tab, setTab] = useState("report");
  const [reward, setReward] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [nextSlug, setNextSlug] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/challenges/${slug}`);
      setChallenge(data.challenge);
      const draft = settings?.autoSave ? await AsyncStorage.getItem(draftKey(slug)) : null;
      setCode(draft || data.challenge.buggyCode);
      setLoading(false);
    })();
    api.get("/challenges").then(({ data }) => {
      const idx = data.challenges.findIndex((c) => c.slug === slug);
      const next = idx >= 0 ? data.challenges[(idx + 1) % data.challenges.length] : null;
      setNextSlug(next && next.slug !== slug ? next.slug : null);
    });
    navigation.setOptions({ title: "" });
    setLines([]);
    setStatus("idle");
    setAttempts(0);
    setReward(null);
  }, [slug]);

  useEffect(() => {
    if (!settings?.autoSave || !challenge) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      AsyncStorage.setItem(draftKey(slug), code);
    }, 600);
    return () => clearTimeout(saveTimer.current);
  }, [code, settings?.autoSave, slug, challenge]);

  const runCode = async () => {
    setRunning(true);
    try {
      const { data } = await api.post(`/challenges/${slug}/run`, { code });
      setAttempts((a) => a + 1);
      if (data.success) {
        setStatus("pass");
        setLines([{ text: "✓ All checks passed", color: colors.success }]);
      } else {
        setStatus("fail");
        setLines(data.errors.map((e) => ({ text: e.msg, color: colors.error })));
      }
    } finally {
      setRunning(false);
    }
  };

  const resetCode = () => {
    setCode(challenge.buggyCode);
    setLines([]);
    setStatus("idle");
    AsyncStorage.removeItem(draftKey(slug));
  };

  const submit = async () => {
    const { data } = await api.post(`/challenges/${slug}/submit`, { code, attempts, usedSolution: false });
    setReward(data);
    AsyncStorage.removeItem(draftKey(slug));
    setUser((prev) => (prev ? { ...prev, xp: prev.xp + data.xpEarned, coins: prev.coins + data.coinsEarned } : prev));
  };

  if (loading || !challenge) {
    return (
      <View style={[styles.screen, { alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator color={colors.violet} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.pillRow}>
        <Pill color={colors.cyan}>{challenge.lang}</Pill>
        <Pill color={colors.muted}>{challenge.difficulty}</Pill>
      </View>
      <Text style={styles.title}>{challenge.title}</Text>

      <View style={styles.tabRow}>
        {["report", "hints", "objective"].map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} style={[styles.tabBtn, tab === t && styles.tabBtnActive]}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === "report" ? "Bug Report" : t[0].toUpperCase() + t.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <Card style={{ marginBottom: 14 }}>
        {tab === "report" && <Text style={styles.bodyText}>{challenge.bugReport}</Text>}
        {tab === "hints" && challenge.hints.map((h, i) => <Text key={i} style={styles.bodyText}>• {h}</Text>)}
        {tab === "objective" && <Text style={styles.bodyText}>{challenge.objective}</Text>}
      </Card>

      <Text style={styles.fileLabel}>{challenge.fileName}</Text>
      <TextInput
        style={[styles.editor, { fontSize: settings?.editorFontSize ?? 12.5 }]}
        value={code}
        onChangeText={setCode}
        multiline
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
      />

      <View style={styles.actionRow}>
        <View style={{ flex: 1 }}>
          <PrimaryButton label="Run" onPress={runCode} loading={running} />
        </View>
        <View style={{ flex: 1 }}>
          <PrimaryButton label="Submit" onPress={submit} disabled={status !== "pass"} />
        </View>
        <View style={{ flex: 1 }}>
          <PrimaryButton label="Reset" onPress={resetCode} variant="secondary" />
        </View>
      </View>

      <View style={styles.statusRow}>
        {status === "pass" && (
          <>
            <CheckCircle2 size={14} color={colors.success} />
            <Text style={[styles.statusText, { color: colors.success }]}>All checks passed</Text>
          </>
        )}
        {status === "fail" && (
          <>
            <AlertTriangle size={14} color={colors.error} />
            <Text style={[styles.statusText, { color: colors.error }]}>{attempts} attempt(s)</Text>
          </>
        )}
      </View>

      <Card style={styles.terminal}>
        {lines.length === 0 ? (
          <Text style={styles.terminalPlaceholder}>Press Run to execute your code…</Text>
        ) : (
          lines.map((l, i) => (
            <Text key={i} style={[styles.terminalLine, { color: l.color }]}>{l.text}</Text>
          ))
        )}
      </Card>

      {reward && (
        <Card style={{ marginTop: 14, borderColor: `${colors.success}55` }}>
          <View style={styles.rewardHeader}>
            <Trophy size={18} color={colors.warn} />
            <Text style={styles.rewardTitle}>Bug squashed 🎉</Text>
          </View>
          <View style={styles.rewardRow}>
            <View style={styles.rewardStat}>
              <Text style={[styles.rewardValue, { color: colors.violet }]}>+{reward.xpEarned}</Text>
              <Text style={styles.rewardLabel}>XP</Text>
            </View>
            <View style={styles.rewardStat}>
              <Text style={[styles.rewardValue, { color: colors.warn }]}>+{reward.coinsEarned}</Text>
              <Text style={styles.rewardLabel}>Coins</Text>
            </View>
          </View>
          {nextSlug && (
            <Pressable
              onPress={() => navigation.push("Challenge", { slug: nextSlug })}
              style={styles.nextBtn}
            >
              <Text style={styles.nextBtnText}>Next Challenge</Text>
              <ChevronRight size={16} color="#fff" />
            </Pressable>
          )}
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.void },
  pillRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  title: { color: colors.text, fontSize: 18, fontWeight: "700", marginBottom: 12 },
  tabRow: { flexDirection: "row", backgroundColor: colors.surface2, borderRadius: 8, padding: 3, marginBottom: 10 },
  tabBtn: { flex: 1, paddingVertical: 7, borderRadius: 6, alignItems: "center" },
  tabBtnActive: { backgroundColor: colors.border },
  tabText: { color: colors.muted, fontSize: 11, fontWeight: "600" },
  tabTextActive: { color: colors.text },
  bodyText: { color: colors.muted, fontSize: 12, lineHeight: 18, marginBottom: 4 },
  fileLabel: { color: colors.muted, fontSize: 11, fontFamily: "Courier", marginBottom: 6 },
  editor: {
    backgroundColor: colors.void,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    color: "#D6D6E6",
    fontFamily: "Courier",
    minHeight: 220,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  actionRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 },
  statusText: { fontSize: 11, fontFamily: "Courier" },
  terminal: { minHeight: 90 },
  terminalPlaceholder: { color: "#5C5C70", fontSize: 12, fontFamily: "Courier" },
  terminalLine: { fontSize: 12, fontFamily: "Courier", marginBottom: 4 },
  rewardHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  rewardTitle: { color: colors.text, fontSize: 14, fontWeight: "600" },
  rewardRow: { flexDirection: "row", justifyContent: "space-around" },
  rewardStat: { alignItems: "center" },
  rewardValue: { fontSize: 18, fontWeight: "700" },
  rewardLabel: { color: colors.muted, fontSize: 10, marginTop: 2 },
  nextBtn: {
    marginTop: 14,
    backgroundColor: colors.violet,
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  nextBtnText: { color: "#fff", fontSize: 14, fontWeight: "600" },
});
