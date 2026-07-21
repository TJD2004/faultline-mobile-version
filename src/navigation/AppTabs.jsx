import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LayoutDashboard, Code2, Calendar, Trophy, User, MoreHorizontal } from "lucide-react-native";
import { colors } from "../theme";

import DashboardScreen from "../screens/DashboardScreen";
import PracticeScreen from "../screens/PracticeScreen";
import DailyChallengeScreen from "../screens/DailyChallengeScreen";
import LeaderboardScreen from "../screens/LeaderboardScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MoreScreen from "../screens/MoreScreen";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.void },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.violet,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Practice"
        component={PracticeScreen}
        options={{ tabBarIcon: ({ color, size }) => <Code2 color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Daily"
        component={DailyChallengeScreen}
        options={{ tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{ tabBarIcon: ({ color, size }) => <Trophy color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{ tabBarIcon: ({ color, size }) => <MoreHorizontal color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}
