'use client'

import { AnimatedList } from "@/components/ui/animated-list";
import { cn } from "@/lib/utils";

interface Item {
    name: string;
    description: string;
    icon: string;
    color: string;
    time: string;
}

let notifications = [
    {
        name: "New message",
        description: "You have a new message from anjan",
        time: "2m ago",
        icon: "💬",
        color: "#15803d",
    },
    {
        name: "Group created",
        description: "rishi created a new group: Dev Chat",
        time: "4m ago",
        icon: "👥",
        color: "#1d4ed8",
    },
    {
        name: "Call missed",
        description: "Missed a voice call from ankit",
        time: "6m ago",
        icon: "📞",
        color: "#b91c1c",
    },
    {
        name: "File shared",
        description: "nayan shared a code snippet",
        time: "9m ago",
        icon: "📎",
        color: "#92400e",
    },
    {
        name: "Reaction received",
        description: "piyush reacted ❤️ to your message",
        time: "12m ago",
        icon: "❤️",
        color: "#9d174d",
    },
    {
        name: "Mentioned in chat",
        description: "You were mentioned by sinu in #general",
        time: "15m ago",
        icon: "🔔",
        color: "#6b21a8",
    },
    {
        name: "New contact",
        description: "anjan added you to contacts",
        time: "18m ago",
        icon: "➕",
        color: "#065f46",
    },
    {
        name: "Status updated",
        description: "rishi updated their status",
        time: "20m ago",
        icon: "📢",
        color: "#78350f",
    },
    {
        name: "Invite accepted",
        description: "ankit joined your dev room",
        time: "24m ago",
        icon: "✅",
        color: "#166534",
    },
    {
        name: "Voice message",
        description: "New voice message from nayan",
        time: "28m ago",
        icon: "🎙️",
        color: "#3730a3",
    },
];

notifications = Array.from({ length: 3 }, () => notifications).flat();

const Notification = ({ name, description, icon, color, time}: Item) => {
    return (
        <figure
            className={cn(
                "relative mx-auto min-h-fit w-full max-w-[400px]  overflow-hidden rounded-2xl p-4",
                "transition-all duration-200 ease-in-out hover:scale-[103%]",
                "bg-neutral-50 border border-neutral-200",
                "transform-gpu dark:bg-neutral-900/40 dark:backdrop-blur-md dark:border dark:border-white/10 dark:shadow-[0_-20px_80px_-20px_#ffffff1f_inset]"
            )}
        >
            <div className="flex flex-row items-center gap-3">
                <div
                    className="flex size-10 items-center justify-center rounded-2xl"
                    style={{
                        backgroundColor: color,
                    }}
                >
                    <span className="text-lg">{icon}</span>
                </div>
                <div className="flex flex-col overflow-hidden">
                    <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium text-neutral-800 dark:text-white">
                        <span className="text-sm sm:text-lg">{name}</span>
                        <span className="mx-1">·</span>
                        <span className="text-xs text-gray-500">{time}</span>
                    </figcaption>
                    <p className="text-sm font-normal text-neutral-600 dark:text-white/60">
                        {description}
                    </p>
                </div>
            </div>
        </figure>
    );
};

export default function RightAnimatedList
    ({
        className,
    }: {
        className?: string;
    }) {
        return (
            <div
                className={cn(
                    "relative flex h-[370px] w-full flex-col overflow-hidden p-2",
                    className,
                )}
            >
                <AnimatedList>
                    {notifications.map((item, idx) => (
                        <Notification {...item} key={idx} />
                    ))}
                </AnimatedList>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
            </div>
        );
    }