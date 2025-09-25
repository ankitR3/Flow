'use client'

import { useThemeMode } from '@/src/store/useThemeStore';
import TooltipComponent from '@/src/utility/ToolTipComponent';
import { CiDark, CiLight } from 'react-icons/ci';
import { useEffect, useState } from 'react';

export default function DarkModeToggle() {
    const { theme, setTheme } = useThemeMode();
    const [mounted, setMounted] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) {
            return;
        }

        if (theme === 'dark') {
            setIsDarkMode(true);
        } else if (theme === 'light') {
            setIsDarkMode(false);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDarkMode(prefersDark);
        }
    }, [theme, mounted]);

    const toggleTheme = () => {
        if (theme === 'dark') {
            setTheme('light');
        } else if (theme === 'light') {
            setTheme('dark');
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(prefersDark ? 'light' : 'dark');
        }
    };

    if (!mounted) {
        return (
            <TooltipComponent content='Switch theme'>
                <div className=''>
                    <button
                        type='button'
                        className='flex items-center gap-2 px-3 py-2 dark:bg-transparent bg-gray-100 rounded-lg transition-all duration-200 transform hover:scale-105'
                        disabled
                    >
                        <CiLight className='text-xl' />
                    </button>
                </div>
            </TooltipComponent>
        );
    }

    return (
        <TooltipComponent content={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
            <div className=''>
                <button
                    type='button'
                    onClick={toggleTheme}
                    className='flex items-center gap-2 px-3 py-2 dark:bg-transparent bg-gray-100 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95'
                    aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                >
                    {isDarkMode ? (
                        <CiLight className='text-xl text-yellow-400' />
                    ) : (
                        <CiDark className='text-lg text-gray-700' />
                    )}
                </button>
            </div>
        </TooltipComponent>
    )
}