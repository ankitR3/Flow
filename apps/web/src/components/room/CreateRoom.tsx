'use client'

import { CREATE_ROOM_URL } from '@/routes/api-routes';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Dialog } from '../ui/dialog';

interface CreateRoomProps {
    onRoomCreated: () => void;
}

export default function createRoom({ onRoomCreated }: CreateRoomProps) {
    const [roomName, setRoomName] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { data:session } = useSession();

    async function handleCreateRoom() {
        if (!roomName.trim()) return;
        setLoading(true);
        await fetch(CREATE_ROOM_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authentication: `Bearer ${(session as any).accessToken}`,
            },
            body: JSON.stringify({ name: roomName })
        });
        setRoomName('');
        setLoading(false);
        setOpen(false);
        onRoomCreated();
    }

    return (
        <Dialog>
            
        </Dialog>
    )
}