import React, { useEffect, useMemo } from "react";
import { View, Image, ActivityIndicator, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import AppTabs from "./AppTabs";
import ChallengeScreen from "../screens/ChallengeScreen";
import SubmissionsScreen from "../screens/SubmissionsScreen";
import ContestListScreen from "../screens/ContestListScreen";
import ContestDetailScreen from "../screens/ContestDetailScreen";
import ContestRankingScreen from "../screens/ContestRankingScreen";
import AchievementsScreen from "../screens/AchievementsScreen";
import BookmarksScreen from "../screens/BookmarksScreen";
import ProjectListScreen from "../screens/ProjectListScreen";
import ProjectDetailScreen from "../screens/ProjectDetailScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Stack = createNativeStackNavigator();

function AuthStack() {
  const { colors } = useTheme();
  const screenOptions = useMemo(
    () => ({
      headerStyle: { backgroundColor: colors.void },
      headerTintColor: colors.text,
      headerShadowVisible: false,
      contentStyle: { backgroundColor: colors.void },
    }),
    [colors]
  );
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function MainStack() {
  const { colors } = useTheme();
  const screenOptions = useMemo(
    () => ({
      headerStyle: { backgroundColor: colors.void },
      headerTintColor: colors.text,
      headerShadowVisible: false,
      contentStyle: { backgroundColor: colors.void },
    }),
    [colors]
  );
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Tabs" component={AppTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Challenge" component={ChallengeScreen} options={{ title: "Challenge" }} />
      <Stack.Screen name="Submissions" component={SubmissionsScreen} options={{ title: "Submissions" }} />
      <Stack.Screen name="Contest" component={ContestListScreen} options={{ title: "Contest" }} />
      <Stack.Screen name="ContestDetail" component={ContestDetailScreen} options={{ title: "" }} />
      <Stack.Screen name="ContestRanking" component={ContestRankingScreen} options={{ title: "Contest Ranking" }} />
      <Stack.Screen name="Achievements" component={AchievementsScreen} options={{ title: "Achievements" }} />
      <Stack.Screen name="Bookmarks" component={BookmarksScreen} options={{ title: "Bookmarks" }} />
      <Stack.Screen name="Projects" component={ProjectListScreen} options={{ title: "Project Mode" }} />
      <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} options={{ title: "" }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: "Settings" }} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { user, loading } = useAuth();
  const { colors, isLight } = useTheme();
  const logoSource = isLight ? require("../../assets/logo-full-light.png") : require("../../assets/logo-full.png");

  // Once auth state is resolved, the app is "ready": drop the native splash
  // screen (visible on standalone/EAS builds) and hand off to the real UI.
  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loading]);

  if (loading) {
    return (
      <View style={[styles.loadingScreen, { backgroundColor: colors.void }]}>
        <Image source={logoSource} style={styles.loadingLogo} resizeMode="contain" />
        <ActivityIndicator color={colors.violet} size="large" style={styles.loadingSpinner} />
      </View>
    );
  }

  return user ? <MainStack /> : <AuthStack />;
}

const styles = StyleSheet.create({
  loadingScreen: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingLogo: { width: 220, height: 187 },
  loadingSpinner: { marginTop: 28 },
});
