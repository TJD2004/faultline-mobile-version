import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider } from "./src/context/AuthContext";
import { SettingsProvider } from "./src/context/SettingsContext";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import RootNavigator from "./src/navigation/RootNavigator";

// Keep the native splash screen (the logo you configured in app.json) on
// screen until RootNavigator decides the app is ready — see the
// SplashScreen.hideAsync() call in RootNavigator.jsx. Must be called in
// global scope, not inside a component. Note: Expo Go itself doesn't render
// this native splash (it shows your app icon instead) — it's the JS loading
// screen in RootNavigator that covers Expo Go, and this native one that
// covers real standalone/EAS builds.
SplashScreen.preventAutoHideAsync().catch(() => {});

function AppContent() {
  const { isLight } = useTheme();
  return (
    <NavigationContainer>
      <StatusBar style={isLight ? "dark" : "light"} />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SettingsProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </SettingsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
