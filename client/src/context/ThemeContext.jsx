
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";

const ThemeContext = createContext(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("darkMode") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      const root = document.documentElement;
      root.classList.toggle("dark", darkMode);
      root.setAttribute("data-theme", darkMode ? "dark" : "light");
      localStorage.setItem("darkMode", darkMode);
    } catch (e) {
      console.error("Theme update failed:", e);
    }
  }, [darkMode]);

  const toggleTheme = useCallback(() => setDarkMode((v) => !v), []);

  const value = useMemo(() => ({ darkMode, toggleTheme, setDarkMode }), [darkMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
