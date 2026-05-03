'use client'

import { CREATE_ROOM_URL } from '@/routes/api-routes';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { PlusIcon } from '@heroicons/react/24/solid';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface CreateRoomProps {
    onRoomCreated: () => void;
}

export default function CreateRoom({ onRoomCreated }: CreateRoomProps) {
    const [roomName, setRoomName] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { data:session } = useSession();

    async function handleCreateRoom() {
        if (!roomName.trim()) return;
        if (!session) return;
        setLoading(true);
        await fetch(CREATE_ROOM_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${(session as any).user?.token}`,
            },
            body: JSON.stringify({
                name: roomName,
                userId: (session as any).user?.id,
                isPrivate: false,
                password: null,
            })
        });
        setRoomName('');
        setLoading(false);
        setOpen(false);
        onRoomCreated();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className='p-2 rounded-full hover:bg-gray-100 transition-all'
                    title='New room'
                >
                    <PlusIcon className='w-5 h-5 text-gray-600'/>
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-sm bg-white'>
                <DialogHeader>
                    <DialogTitle className='text-gray-900'>Create a room</DialogTitle>
                </DialogHeader>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor='room-name' className='text-gray-700' >Room name</Label>
                    <Input
                        id='room-name'
                        placeholder='e.g. General, Design, Team...'
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        className='text-gray-900 placeholder:text-gray-400'
                    />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant='outline'>Cancel</Button>
                    </DialogClose>
                    <Button className='text-black' onClick={handleCreateRoom} disabled={loading}>
                        {loading ? 'Creating...' : 'Create'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}