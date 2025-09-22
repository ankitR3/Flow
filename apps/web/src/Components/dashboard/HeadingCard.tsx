'use client'

import { useUserSessionStore } from "@/src/store/useUserSessionStore"

export default function HeadingCard() {
    const { session } = useUserSessionStore();

    return (
        <div className="w-full flex justify-center braniella-font tracking-wider items-center text-2xl dark:text-[#e2e2e2] text-black">
            Welcome,{' '}
            <span className="text-[#E6FF52]">
                {session?.user?.name?.split(' ')[0]}
            </span>
        </div>
    );
}