'use client'

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { JOIN_ROOM_URL } from '@/routes/api-routes';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import axios from 'axios';
import { SocketManager } from '@/src/hooks/useSocket';
import { MessageType } from '@/src/types/socket.types';

interface JoinRoomProps {
    onRoomJoined: () => void;
}

export default function JoinRoom({ onRoomJoined }: JoinRoomProps) {
    const { data: session } = useSession();
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    async function handleJoinRoom() {
        if (!code.trim() || !session) return;
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post(JOIN_ROOM_URL, {
                code: code.toUpperCase(),
                userId: (session as any).user?.id,
            }, {
                headers: {
                    Authorization: `Bearer ${(session as any).user?.token}`,
                }
            });

            if (res.data.success) {
                const roomId = res.data.room.id;
                const userId = (session as any).user?.id;
                const username = (session as any).user?.name;

                const sendJoinEvent = (socket: WebSocket) => {
                    socket.send(JSON.stringify({
                        type: MessageType.ROOM_JOINED,
                        roomId,
                        payload: {
                            roomId,
                            userId,
                            username
                        }
                    }));
                };

                const socket = SocketManager.connect();
                if (socket.readyState === WebSocket.OPEN) {
                    sendJoinEvent(socket);
                } else {
                    socket.addEventListener('open', () => sendJoinEvent(socket), {
                        once: true
                    });
                }
                setSuccess(true);
                setCode('');
                onRoomJoined();
            } else {
                setError(res.data.message || 'Failed to join room');
            }
        } catch (err: any) {
            console.error('Join room error FULL:', err);
            console.error('Response:', err?.response?.data);
            console.error('Message:', err?.message);
            setError(
                err?.response?.data?.message || err?.message || 'Something went wrong. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='h-screen flex flex-col items-center justify-center bg-white w-120 border-r border-gray-200'>
            <div className='w-full max-w-sm px-6'>
                <h2 className='text-xl font-semibold text-gray-900 mb-1'>Join a room</h2>
                <p className='text-sm text-gray-400 mb-6'>Enter the room code to join</p>

                <div className='flex flex-col gap-3'>
                    <Label htmlFor='code' className='text-gray-700'>Room code</Label>
                    <Input
                        id='code'
                        placeholder='e.g. ABC123'
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        className='text-gray-900 placeholder:text-gray-400 tracking-widest font-mono'
                        maxLength={6}
                    />

                    {error && (
                        <p className='text-xs text-red-500'>{error}</p>
                    )}

                    {success && (
                        <p className='text-xs text-green-500'>Joined successfully!</p>
                    )}

                    <Button
                        onClick={handleJoinRoom}
                        disabled={loading || !code.trim()}
                        className='w-full'
                    >
                        {loading ? 'Joining...' : 'Join Room'}
                    </Button>
                </div>
            </div>
        </div>
    )
}