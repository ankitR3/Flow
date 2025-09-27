'use client'

import { useSettingsRendererStore } from "@/src/store/useSettingsActiveStore";
import { useThemeMode } from "@/src/store/useThemeStore"
import ThemeCard from "@/src/utility/ThemeCard";
import { MdComputer, MdDarkMode, MdLightMode } from "react-icons/md";

export default function SettingsChangeTheme() {
    const { theme, setTheme } = useThemeMode();
    const { value, setValue } = useSettingsRendererStore();

    return (
        <div className="w-full h-full flex flex-col justify-start items-start pt-10">
            <div className="flex w-full max-w-5xl justify-around">
                <ThemeCard
                    label="Light"
                    mode="light"
                    selected={theme === "light"}
                    onClick={() => setTheme("light")}
                    icon={<MdLightMode className="text-xl" />}
                    bgClass="bg-[#e4e4e4]"
                />
                <ThemeCard
                    label="Dark"
                    mode="dark"
                    selected={theme === "dark"}
                    onClick={() => setTheme("dark")}
                    icon={<MdDarkMode className="text-xl" />}
                    bgClass="bg-black"
                />
                <ThemeCard
                    label="System"
                    mode="system"
                    selected={theme === "system"}
                    onClick={() => setTheme("system")}
                    icon={<MdComputer className="text-xl" />}
                    bgClass="bg-gradient-to-r from-black to-[#e4e4e4]"
                />
            </div>
        </div>
    );
}