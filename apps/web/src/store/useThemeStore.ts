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

const applyTheme = (theme: ThemeType) => {
    const root = document.documentElement;

    if (theme === 'dark') {
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark')
    } else if (theme === 'light') {
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.setItem('theme', 'system');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }
};

// Hook to sync DOM with Zustand store
export const useThemeMode = () => {
    const { theme, setTheme } = useThemeStore();

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as ThemeType | null;

        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
            setTheme(savedTheme);
            applyTheme(savedTheme);
        } else {
            setTheme('system');
            applyTheme('system');
        }

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            const currentTheme = localStorage.getItem('theme');
            if (currentTheme === 'system') {
                applyTheme('system');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [setTheme]);

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    return { theme, setTheme };
};