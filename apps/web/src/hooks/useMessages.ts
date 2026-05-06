'use client'

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { GET_MESSAGE_URL } from '@/routes/api-routes';

interface Message {
    senderId: string;
    message: string;
    timestamp: string;
}

export function useMessages(roomId: string) {
    const { data: session } = useSession();
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        async function fetchMessages() {
            if (!session || !roomId) return;
            try {
                const res = await axios.get(GET_MESSAGE_URL(roomId), {
                    headers: {
                        Authorization: `Bearer ${(session as any).user?.token}`,
                    }
                });
                console.log('messages response: ', res.data);
                const fetched = res.data.messages ?? [];
                setMessages(fetched.map((msg: any) => ({
                    senderId: msg.author.id,
                    message: msg.content,
                    timestamp: msg.createdAt,
                })));
            } catch (err) {
                console.log('get message error: ', err);
            }
        }
        fetchMessages();
    }, [roomId, session]);

    return { messages, setMessages };
}