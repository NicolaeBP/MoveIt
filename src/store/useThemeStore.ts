import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'auto';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeStore {
  theme: Theme;
  systemTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  setSystemTheme: (theme: ResolvedTheme) => void;
  initializeTheme: () => Promise<void>;
  subscribeToSystemTheme: () => (() => void) | undefined;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'auto',
      systemTheme: 'light',
      setTheme: (theme: Theme) => set({ theme }),
      setSystemTheme: (systemTheme: ResolvedTheme) => set({ systemTheme }),
      initializeTheme: async () => {
        const themeAPI = window.electronAPI?.theme;

        const mediaQueryFallback = () => {
          const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          set({ systemTheme: isDark ? 'dark' : 'light' });
        };

        // Detect initial system theme
        if (themeAPI?.shouldUseDarkColors) {
          try {
            const isDark = await themeAPI.shouldUseDarkColors();

            set({ systemTheme: isDark ? 'dark' : 'light' });
          } catch {
            mediaQueryFallback();
          }
        } else {
          mediaQueryFallback();
        }
      },

      subscribeToSystemTheme: () => {
        const themeAPI = window.electronAPI?.theme;

        // Listen for system theme changes
        if (themeAPI?.onNativeThemeUpdated) {
          return themeAPI.onNativeThemeUpdated((isDark: boolean) => set({ systemTheme: isDark ? 'dark' : 'light' }));
        } else {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

          const handleChange = (e: MediaQueryListEvent) => set({ systemTheme: e.matches ? 'dark' : 'light' });

          mediaQuery.addEventListener('change', handleChange);

          return () => mediaQuery.removeEventListener('change', handleChange);
        }
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
