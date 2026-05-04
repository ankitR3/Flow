'use client'
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { GET_ROOM_URL } from '@/routes/api-routes';

interface Room {
    id: string;
    name: string;
    code: string;
    lastMessage?: string;
    updatedAt?: string;
}

export function useRooms() {
    const { data: session } = useSession();
    const [rooms, setRooms] = useState<Room[]>([]);

    async function fetchRooms() {
        if (!session) return;
        const userId = (session as any).user?.id;
        const res = await fetch(`${GET_ROOM_URL}?userId=${userId}`, {
            headers: {
                Authorization: `Bearer ${(session as any).user?.token}`,
            }
        });
        const data = await res.json();
        const allRooms = [
            ...(data.ownerRooms ?? []),
            ...(data.joinedRooms ?? []),
        ];
        setRooms(allRooms);
    }

    useEffect(() => {
        fetchRooms();
    }, [session]);

    return { rooms, fetchRooms };
}