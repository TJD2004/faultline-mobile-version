import axios from "axios";
import * as SecureStore from "expo-secure-store";

// IMPORTANT: "localhost" only works from a simulator on the same machine as
// the backend. For a physical phone (or Expo Go), set this to your
// computer's LAN IP, e.g. "http://192.168.1.42:5000/api", or to a deployed
// backend URL. Easiest: create a .env-style config via app.json "extra" or
// just edit this constant directly during development.
const API_URL = "https://faultline-debugging-practice-platform.onrender.com/api";

export const TOKEN_KEY = "faultline_token";

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response && err.response.status === 401) {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
    return Promise.reject(err);
  }
);

export default api;
export { API_URL };
