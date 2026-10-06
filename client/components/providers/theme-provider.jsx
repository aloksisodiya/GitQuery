"use client";

import * as React from "react";
const ThemeContext = React.createContext(null);
function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
export function ThemeProvider({ children, defaultTheme = "system" }) {
  const [theme, setThemeState] = React.useState(() => {
    var _a;
    if (typeof window === "undefined") return defaultTheme;
    return (_a = localStorage.getItem("gitquery-theme")) !== null &&
      _a !== void 0
      ? _a
      : defaultTheme;
  });
  const resolvedTheme = theme === "system" ? getSystemTheme() : theme;
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
    localStorage.setItem("gitquery-theme", theme);
  }, [resolvedTheme, theme]);
  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme: setThemeState,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
