import { useTheme } from '../context/ThemeContext';

/**
 * useDarkMode
 *
 * Convenience hook that surfaces the two things every consumer needs:
 *   - isDark    → boolean, whether dark mode is currently active
 *   - toggleTheme → () => void, flips the mode and persists the choice
 *
 * Usage:
 *   const { isDark, toggleTheme } = useDarkMode();
 */
export function useDarkMode() {
  const { isDark, toggleTheme } = useTheme();
  return { isDark, toggleTheme };
}
