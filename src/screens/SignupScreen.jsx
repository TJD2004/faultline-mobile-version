import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Bug } from "lucide-react-native";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme";
import PrimaryButton from "../components/PrimaryButton";

export default function SignupScreen({ navigation }) {
  const { signup, loginWithGoogle } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSignup = async () => {
    setError("");
    setBusy(true);
    try {
      await signup(name, email, password);
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setBusy(true);
    try {
      const ok = await loginWithGoogle();
      if (!ok) setError("Google sign-in was cancelled or failed");
    } catch {
      setError("Google sign-in failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoRow}>
          <View style={styles.logoBox}>
            <Bug size={22} color={colors.void} />
          </View>
          <Text style={styles.logoText}>Faultline</Text>
        </View>

        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>Start fixing real bugs today.</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ada Lovelace" placeholderTextColor={colors.muted} />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="At least 8 characters"
          placeholderTextColor={colors.muted}
          secureTextEntry
        />

        <View style={{ height: 8 }} />
        <PrimaryButton label="Sign up" onPress={handleSignup} loading={busy} />
        <View style={{ height: 10 }} />
        <PrimaryButton label="Continue with Google" onPress={handleGoogle} variant="secondary" disabled={busy} />

        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
            Log in
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.void },
  container: { flexGrow: 1, justifyContent: "center", padding: 24 },
  logoRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 28, gap: 8 },
  logoBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.violet, alignItems: "center", justifyContent: "center" },
  logoText: { color: colors.text, fontSize: 20, fontWeight: "700", marginLeft: 8 },
  title: { color: colors.text, fontSize: 20, fontWeight: "700", marginBottom: 4 },
  subtitle: { color: colors.muted, fontSize: 13, marginBottom: 20 },
  error: { color: colors.error, fontSize: 12, marginBottom: 12 },
  label: { color: colors.muted, fontSize: 12, marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 14,
  },
  footerText: { color: colors.muted, fontSize: 12, textAlign: "center", marginTop: 24 },
  link: { color: colors.violet, fontWeight: "600" },
});
