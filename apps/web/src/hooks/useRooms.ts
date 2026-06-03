'use client'

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { GET_ROOM_URL } from '@/routes/api-routes';
import axios from 'axios';
import { useDashboardStore } from '@/src/store/useDashboardStore';

interface Room {
    id: string;
    name: string;
    code: string;
    ownerId: string;
    lastMessage?: string;
    updatedAt?: string;
}

export function useRooms() {
    const { data: session } = useSession();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const { lastMessageUpdate } = useDashboardStore();

    async function fetchRooms() {
        if (!session) return;
        const userId = (session as any).user?.id;
        try {
            const res = await axios.get(`${GET_ROOM_URL}?userId=${userId}`, {
                headers: {
                    Authorization: `Bearer ${(session as any).user?.token}`,
                }
            });
            const data = res.data;
            const allRooms = [
                ...(data.ownerRooms ?? []),
                ...(data.joinedRooms ?? []),
            ].map((room: any) => ({
                ...room,
                lastMessage: room.message?.[0]?.content ?? null,
            }));
            setRooms(allRooms);
        } catch (err) {
            console.log('get room error: ', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRooms();
    }, [session]);

    useEffect(() => {
        if (!lastMessageUpdate) return;
        setRooms(prev => prev.map(room =>
            room.id === lastMessageUpdate.roomId
                ? { ...room, lastMessage: lastMessageUpdate.message }
                : room
        ));
    }, [lastMessageUpdate])

    return { rooms, fetchRooms, loading };
}