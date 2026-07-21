import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { Play, Send, RotateCcw, Trophy, CheckCircle2, AlertTriangle } from "lucide-react-native";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme";
import Card from "../components/Card";
import Pill from "../components/Pill";
import PrimaryButton from "../components/PrimaryButton";

export default function ProjectDetailScreen({ route }) {
  const { slug } = route.params;
  const { setUser } = useAuth();

  const [project, setProject] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [filesState, setFilesState] = useState({});
  const [activeFile, setActiveFile] = useState(null);
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState("idle");
  const [attempts, setAttempts] = useState(0);
  const [reward, setReward] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    api.get(`/projects/${slug}`).then(({ data }) => {
      setProject(data.project);
      setFileList(data.files);
      const initial = {};
      data.files.forEach((f) => (initial[f.file_path] = f.buggy_content));
      setFilesState(initial);
      setActiveFile(data.files.find((f) => f.is_entry_point)?.file_path || data.files[0]?.file_path);
      setLoading(false);
    });
  }, [slug]);

  const runProject = async () => {
    setRunning(true);
    try {
      const { data } = await api.post(`/projects/${slug}/run`, { files: filesState });
      setAttempts((a) => a + 1);
      setStatus(data.success ? "pass" : "fail");
      setErrors(data.success ? [] : data.errors);
    } finally {
      setRunning(false);
    }
  };

  const resetProject = () => {
    const initial = {};
    fileList.forEach((f) => (initial[f.file_path] = f.buggy_content));
    setFilesState(initial);
    setErrors([]);
    setStatus("idle");
  };

  const submit = async () => {
    const { data } = await api.post(`/projects/${slug}/submit`, { files: filesState, attempts, usedSolution: false });
    setReward(data);
    setUser((prev) => (prev ? { ...prev, xp: prev.xp + data.xpEarned, coins: prev.coins + data.coinsEarned } : prev));
  };

  if (loading || !project) {
    return (
      <View style={[styles.screen, { alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator color={colors.violet} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.pillRow}>
        <Pill color={colors.cyan}>{project.lang}</Pill>
        <Pill color={colors.muted}>{project.difficulty}</Pill>
      </View>
      <Text style={styles.title}>{project.title}</Text>

      <Card style={{ marginBottom: 12 }}>
        <Text style={styles.bodyText}>{project.bugReport}</Text>
      </Card>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
        {fileList.map((f) => (
          <Pressable
            key={f.file_path}
            onPress={() => setActiveFile(f.file_path)}
            style={[styles.fileTab, activeFile === f.file_path && styles.fileTabActive]}
          >
            <Text style={[styles.fileTabText, activeFile === f.file_path && styles.fileTabTextActive]} numberOfLines={1}>
              {f.file_path}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <TextInput
        style={styles.editor}
        value={filesState[activeFile] || ""}
        onChangeText={(text) => setFilesState((prev) => ({ ...prev, [activeFile]: text }))}
        multiline
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
      />

      <View style={styles.actionRow}>
        <View style={{ flex: 1 }}><PrimaryButton label="Run" onPress={runProject} loading={running} /></View>
        <View style={{ flex: 1 }}><PrimaryButton label="Submit" onPress={submit} disabled={status !== "pass"} /></View>
        <View style={{ flex: 1 }}><PrimaryButton label="Reset" onPress={resetProject} variant="secondary" /></View>
      </View>

      <View style={styles.statusRow}>
        {status === "pass" && <><CheckCircle2 size={14} color={colors.success} /><Text style={[styles.statusText, { color: colors.success }]}>All checks passed</Text></>}
        {status === "fail" && <><AlertTriangle size={14} color={colors.error} /><Text style={[styles.statusText, { color: colors.error }]}>{attempts} attempt(s)</Text></>}
      </View>

      <Card style={styles.terminal}>
        {errors.length === 0 && status !== "pass" && <Text style={styles.terminalPlaceholder}>Press Run to check every file…</Text>}
        {status === "pass" && <Text style={[styles.terminalLine, { color: colors.success }]}>✓ All checks passed across every file</Text>}
        {errors.map((e, i) => (
          <Text key={i} style={[styles.terminalLine, { color: colors.error }]}>{e.file ? `[${e.file}] ` : ""}{e.msg}</Text>
        ))}
      </Card>

      {reward && (
        <Card style={{ marginTop: 14, borderColor: `${colors.success}55` }}>
          <View style={styles.rewardHeader}>
            <Trophy size={18} color={colors.warn} />
            <Text style={styles.rewardTitle}>Project fixed 🎉</Text>
          </View>
          <View style={styles.rewardRow}>
            <View style={styles.rewardStat}><Text style={[styles.rewardValue, { color: colors.violet }]}>+{reward.xpEarned}</Text><Text style={styles.rewardLabel}>XP</Text></View>
            <View style={styles.rewardStat}><Text style={[styles.rewardValue, { color: colors.warn }]}>+{reward.coinsEarned}</Text><Text style={styles.rewardLabel}>Coins</Text></View>
          </View>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.void },
  pillRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  title: { color: colors.text, fontSize: 18, fontWeight: "700", marginBottom: 12 },
  bodyText: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  fileTab: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, marginRight: 8 },
  fileTabActive: { backgroundColor: colors.border },
  fileTabText: { color: colors.muted, fontSize: 11, fontFamily: "Courier" },
  fileTabTextActive: { color: colors.text },
  editor: {
    backgroundColor: colors.void,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    color: "#D6D6E6",
    fontFamily: "Courier",
    fontSize: 12.5,
    minHeight: 240,
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
});
