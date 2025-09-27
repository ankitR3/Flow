import React from "react";
import { ThemeType } from "../store/useThemeStore";
import { MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked } from "react-icons/md";


interface ThemeCardProps {
    label: string;
    mode: ThemeType;
    selected: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    bgClass: string;
}

export default function ThemeCard({ label, selected, onClick, icon, bgClass, mode}: ThemeCardProps) {
    return (
        <div
            onClick={onClick}
            className={`
                w-64 h-40 border-2 rounded-lg cursor-pointer transition-all duration-200
                hover:border-[#699202] dark:hover:border-[#b8e741da]
                ${selected
                    ? 'border-[#699202] dark:border-[#b8e741da]'
                    : 'border-neutral-200 dark:border-neutral-700'
                }
                ${bgClass}
            `}
        >
            <div className="h-24 rounded-t-md overflow-hidden">
                <div className="{`h-full ${bgClass} relative`}">
                    <div className="absolute inset-0-3">
                        <div className="w-8 h-2 bg-gray-400 rounded mb-2 opacity-60"></div>
                        <div className="w-12 h-2 bg-gray-400 rounded opacity-40"></div>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-white dark:bg-neutral-900 rounded-b-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="text-neutral-800 dark:text-gray-400">
                        {icon}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                        {label}
                    </span>
                </div>
                <div>
                    {selected ? (
                        <MdOutlineRadioButtonChecked className="text-xl text-gray-900 dark:text-[#b8e741da]" />
                    ) : (
                        <MdOutlineRadioButtonUnchecked className="text-xl" />
                    )}
                </div>
            </div>
        </div>
    );
}