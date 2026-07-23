// Mirrors the web app's Tailwind color tokens (frontend/tailwind.config.js)
// so both clients look and feel like the same product. Two palettes are
// provided — ThemeContext picks between them based on the user's setting.
export const darkColors = {
  mode: "dark",
  void: "#0A0A0F",
  surface: "#12121B",
  surface2: "#191925",
  border: "#262635",
  text: "#E7E7EF",
  muted: "#8B8BA3",
  violet: "#7C6FFF",
  cyan: "#4FD1E8",
  success: "#34D399",
  error: "#F87171",
  warn: "#FBBF24",
};

export const lightColors = {
  mode: "light",
  void: "#F4F4F9",
  surface: "#FFFFFF",
  surface2: "#ECECF5",
  border: "#DBDBE8",
  text: "#16161F",
  muted: "#6B6B80",
  violet: "#6C56F9",
  cyan: "#0D93A8",
  success: "#0E9F63",
  error: "#DC2F3A",
  warn: "#B4790C",
};

// The code editor panes (Challenge / Project Mode) always stay dark for
// readability, like most code editors do regardless of OS theme.
export const editorColors = {
  background: "#0A0A0F",
  border: darkColors.border,
  text: "#D6D6E6",
};

// Back-compat named export for anything not yet migrated to useTheme().
export const colors = darkColors;

export const fonts = {
  display: "System", // swap for a loaded Space Grotesk font asset if desired
  mono: "Courier",
};
