'use client'

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { JOIN_ROOM_URL } from '@/routes/api-routes';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import axios from 'axios';

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
        if (!code.trim()) return;
        if (!session) return;
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
                setSuccess(true);
                setCode('');
                onRoomJoined();
            } else {
                setError(res.data.message);
            }
        } catch {
            setError('Something went wrong. Please try again.');
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