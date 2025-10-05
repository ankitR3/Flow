"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import "@theme-toggles/react/css/Classic.css";
import { Classic } from "@theme-toggles/react";

export default function DarkModeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const isDark = resolvedTheme === "dark";

    return (
        <Classic
            className="dark:bg-white bg-black font-sans dark:text-white text-black text-2xl"
            text-xl
            toggled={isDark}
            toggle={(next) => {
                const newVal =
                    typeof next === "function" ? next(isDark) : next;
                setTheme(newVal ? "dark" : "light");
            }}
            duration={750}
            {...({} as React.ComponentProps<typeof Classic>)}
        />
    );
}