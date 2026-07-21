import React from "react";
import { View, ActivityIndicator } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme";

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

const screenOptions = {
  headerStyle: { backgroundColor: colors.void },
  headerTintColor: colors.text,
  headerShadowVisible: false,
  contentStyle: { backgroundColor: colors.void },
};

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function MainStack() {
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

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.void }}>
        <ActivityIndicator color={colors.violet} size="large" />
      </View>
    );
  }

  return user ? <MainStack /> : <AuthStack />;
}
