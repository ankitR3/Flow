import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import SessionProvider from "@/src/providers/SessionProvider";
import { WebSocketProvider } from "@/src/providers/WSProvider";
import { getServerSession } from "next-auth";
import React from "react"

interface LayoutProps {
    children: React.ReactNode
}

export default async function Layout({ children }: LayoutProps) {
    const session = await getServerSession(authOptions);

    return (
        <div>
            <WebSocketProvider url={process.env.NEXTAUTH_PUBLIC_WS_URL!}>
                {children}
                <SessionProvider session={session} />
            </WebSocketProvider>
        </div>
    )
}