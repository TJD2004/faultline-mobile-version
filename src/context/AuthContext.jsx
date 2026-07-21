import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import api, { API_URL, TOKEN_KEY } from "../api/axios";

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCurrentUser = async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const signup = async (name, email, password) => {
    const { data } = await api.post("/auth/signup", { name, email, password });
    await SecureStore.setItemAsync(TOKEN_KEY, data.token);
    setUser(data.user);
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    await SecureStore.setItemAsync(TOKEN_KEY, data.token);
    setUser(data.user);
  };

  // Opens the system browser to the backend's Google OAuth flow and waits
  // for it to redirect back into the app via the "faultline://" deep link
  // (or the Expo Go proxy URL during development — createURL handles both).
  const loginWithGoogle = async () => {
    const redirectUri = Linking.createURL("oauth-success");
    const authUrl = `${API_URL}/auth/google?platform=mobile&redirect_uri=${encodeURIComponent(redirectUri)}`;

    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
    if (result.type === "success" && result.url) {
      const token = Linking.parse(result.url).queryParams?.token;
      if (token) {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
        await loadCurrentUser();
        return true;
      }
    }
    return false;
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, signup, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
