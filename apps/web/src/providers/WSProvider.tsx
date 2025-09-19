'use client'

import { createContext, useContext } from "react";
import { useWebSocket, UseWebSocketReturn } from "../hooks/useSocket";

const WebSocketContext = createContext<UseWebSocketReturn | null>(null);

interface WebSocketProviderProps {
    children: React.ReactNode,
    url: string
}

export const WebSocketProvider = ({ children, url }: WebSocketProviderProps) => {
    const socket = useWebSocket({ url, autoConnect: true });

    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useSocketContext = (): UseWebSocketReturn => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useSocketContext must be added within a WebSocketProvider')
    }
    return context;
}