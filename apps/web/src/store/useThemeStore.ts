import { create } from 'zustand';
import { useEffect } from 'react';

export type ThemeType = 'light' | 'dark' | 'system';

interface ThemeState {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
}

// Zustand Store
export const useThemeStore = create<ThemeState>((set) => ({
    theme: 'system',
    setTheme: (theme) => {
        set(() => ({ theme }));
    },
}));

// Hook to sync DOM with Zustand store
export const useThemeMode = () => {
    const { theme, setTheme } = useThemeStore();

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as ThemeType | null;
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (savedTheme === "light" || savedTheme === "dark") {
            setTheme(savedTheme);
        } else {
            setTheme("system");
            if (prefersDark) {
                document.documentElement.classList.add("dark");
            }
        }
    }, [setTheme]);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else if (theme === 'light') {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        } else {
            localStorage.removeItem("theme");
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            if (prefersDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, [theme]);

    return { theme, setTheme };
};