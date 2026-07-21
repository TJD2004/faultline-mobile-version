import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "faultline_settings";
const DEFAULTS = { editorFontSize: 13, autoSave: true };

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setSettings({ ...DEFAULTS, ...JSON.parse(raw) });
        } catch {
          // ignore malformed stored settings, fall back to defaults
        }
      }
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings, loaded]);

  const updateSetting = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));
  const resetSettings = () => setSettings(DEFAULTS);

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
