import { useEffect, useCallback, useRef } from 'react';
import { MessageType } from '../types/socket.types';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://localhost:1515';

export class SocketManager {
    private static instance: WebSocket | null = null;

    static connect(): WebSocket {
        if (!this.instance || this.instance.readyState == WebSocket.CLOSED) {
            console.log('creating new socket connection');
            this.instance = new WebSocket(SOCKET_URL);
        }
        return this.instance;
    }

    static disconnect() {
        if (this.instance) {
            this.instance.close();
            this.instance = null;
        }
    }
}

export function disconnectSocket() {
    SocketManager.disconnect();
}

interface UseSocketProps {
    roomId: string;
    userId: string;
    username: string;
    onMessage: (message: any) => void;
}

export function useSocket({ roomId, userId, username, onMessage}: UseSocketProps) {
    const socketRef = useRef<WebSocket | null>(null);
    const onMessageRef = useRef(onMessage);

    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    const sendMessage = useCallback((message: string) => {
        const socket = socketRef.current;
        if (!socket || socket.readyState !== WebSocket.OPEN) return;

        socket.send(JSON.stringify({
            type: MessageType.CHAT,
            roomId,
            payload: {
                message,
                senderId: userId,
                senderName: username,
                timestamp: new Date().toISOString(),
            }
        }));
    }, [roomId, userId, username]);

    const sendTyping = useCallback((isTyping: boolean) => {
        const socket = socketRef.current;
        if (!socket || socket.readyState !== WebSocket.OPEN) return;

        socket.send(JSON.stringify({
            type: isTyping ? MessageType.TYPING : MessageType.STOP_TYPING,
            roomId,
            payload: {
                userId,
                username,
            }
        }));
    }, [roomId, userId, username]);

    useEffect(() => {
        const socket = SocketManager.connect();
        socketRef.current = socket;
        let subscribed = false;

        const handleOpen = () => {
            socket.send(JSON.stringify({
                type: MessageType.SUBSCRIBE,
                roomId,
                payload: {
                    userId
                }
            }));
            subscribed = true;
        }

        const handleMessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);
                onMessageRef.current(data);
            } catch (err) {
                console.log('Failed to parse message: ', err);
            }
        }

        if (socket.readyState === WebSocket.OPEN) {
            handleOpen();
        } else {
            socket.addEventListener('open', handleOpen);
        }

        socket.addEventListener('message', handleMessage);

        return () => {
            socket.removeEventListener('open', handleOpen);
            socket.removeEventListener('message', handleMessage);

            if (subscribed && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    type: MessageType.UNSUBSCRIBE,
                    roomId,
                }));
            }
        };
    }, [roomId, userId]);

    return { sendMessage, sendTyping };
}