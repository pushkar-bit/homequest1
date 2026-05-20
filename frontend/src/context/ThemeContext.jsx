import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

// ─── Storage key ────────────────────────────────────────────────────────────
const STORAGE_KEY = 'hq-theme';

// ─── Context ─────────────────────────────────────────────────────────────────
export const ThemeContext = createContext({
  isDark: true,
  toggleTheme: () => {},
});

// ─── Helper: sync the <html> class with the current value ───────────────────
function applyClass(dark) {
  if (dark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// ─── Helper: read the persisted preference, default to dark ─────────────────
function readPreference() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    // If nothing is stored yet, fall back to dark mode (matches existing app default)
    return stored === null ? true : stored === 'true';
  } catch {
    // localStorage may be blocked in certain private-browsing contexts
    return true;
  }
}

// ─── Provider ────────────────────────────────────────────────────────────────
export function ThemeProvider({ children }) {
  // Initialise from storage synchronously so the first render already knows
  // the right value — avoids a flash of the wrong theme.
  const [isDark, setIsDark] = useState(readPreference);

  // On mount (and whenever isDark changes) keep the DOM class in sync.
  useEffect(() => {
    applyClass(isDark);
    try {
      localStorage.setItem(STORAGE_KEY, String(isDark));
    } catch {
      // Silently ignore write failures (e.g. storage quota exceeded).
    }
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─── Low-level hook (consumed by useDarkMode) ────────────────────────────────
export function useTheme() {
  return useContext(ThemeContext);
}
