import { useCallback, useEffect, useRef, useState } from "react";
import { SocketType, WebSocketStatus } from "../types/socketTypes";
import WebSocketClient from "../socket/socket.font";
import { getWebSocketClient } from "../singleton/ws-singleton";


export interface UseWebSocketOptions {
    url?: string;
    autoConnect?: boolean;
}

export interface UseWebSocketReturn {
    status: WebSocketStatus;
    messages: SocketType[];
    subscribe: (roomId: string, userId: string) => void;
    unsubscribe: (roomId: string) => void;
    sendMessage: (roomId: string, message: string, senderId: string) => void;
    connect: () => Promise<void>;
    disconnect: () => void;
    clearMessages: () => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}): UseWebSocketReturn => {
    const { url, autoConnect = true} = options;
    const [status, setStatus] = useState<WebSocketStatus>(WebSocketStatus.DISCONNECTED);
    const [messages, setMessages] = useState<SocketType[]>([]);
    const clientRef = useRef<WebSocketClient | null>(null);

    useEffect(() => {
        console.log('inside socket');
        if (url && !clientRef.current) {
            clientRef.current = getWebSocketClient(url);
        } else if (!url && !clientRef.current) {
            try {
                clientRef.current = getWebSocketClient();
            } catch (err) {
                console.error('ws-client not initialized', err);
            }
        }

        console.log('ws connected');
    }, [url]);

    useEffect(() => {
        if (!clientRef.current) {
            return;
        }

        const client = clientRef.current;

        const removeMessageHandler = client.addMessageHandler((message) => {
            setMessages(prev => [...prev, message]);
        });

        const removeStatusHandler = client.addStatusHandler((newStatus) => {
            setStatus(newStatus);
        });

        setStatus(client.getStatus());

        return () => {
            removeMessageHandler();
            removeStatusHandler();
        };
    }, []);

    useEffect(() => {
        if (autoConnect && clientRef.current && status === WebSocketStatus.DISCONNECTED) {
            clientRef.current.connect().catch(console.error);
        }
    }, [autoConnect, status]);

    const subscribe = useCallback((roomId: string, userId: string) => {
        clientRef.current?.subscribe(roomId, userId)
    }, []);

    const unsubscribe = useCallback((roomId: string) => {
        clientRef.current?.unsubscribe(roomId);
    }, []);

    const sendMessage = useCallback((roomId: string, message: string, senderId: string) => {
        clientRef.current?.sendChatMessage(roomId, message, senderId);
    }, []);

    const connect = useCallback(async () => {
        if (clientRef.current) {
            await clientRef.current.connect();
        }
    }, []);

    const disconnect = useCallback(() => {
        clientRef.current?.disconnect();
    }, []);

    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    return {
        status,
        messages,
        subscribe,
        unsubscribe,
        sendMessage,
        connect,
        disconnect,
        clearMessages
    };
};