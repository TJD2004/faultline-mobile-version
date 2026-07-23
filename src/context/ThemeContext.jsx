import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { darkColors, lightColors, fonts } from "../theme";

const STORAGE_KEY = "faultline_theme_mode"; // "dark" | "light"

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState("dark");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw === "light" || raw === "dark") setModeState(raw);
      setLoaded(true);
    });
  }, []);

  const setMode = (next) => {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next);
  };

  const toggleTheme = () => setMode(mode === "light" ? "dark" : "light");

  const value = useMemo(
    () => ({
      mode,
      isLight: mode === "light",
      colors: mode === "light" ? lightColors : darkColors,
      fonts,
      setMode,
      toggleTheme,
      loaded,
    }),
    [mode, loaded]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
