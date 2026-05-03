'use client'

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { GET_ROOM_URL } from '@/routes/api-routes';
import CreateRoom from '../room/CreateRoom';

interface Room {
    id: string;
    name: string;
    lastMessage?: string;
    updatedAt?: string;
}

export default function ChatPanel() {
    const { data: session } = useSession();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('All');
    
    async function fetchRooms() {
        if (!session) return;
        // console.log('token:', (session as any).user?.token);
        const res = await fetch(GET_ROOM_URL, {
            headers: {
                Authorization: `Bearer ${(session as any).user?.token}`,
                'user-id': (session as any).user?.id ?? '',
            }
        });
        const data = await res.json();
        // console.log('API response:', data);
        setRooms(Array.isArray(data) ? data : data.rooms ?? data.data ?? []);
    }
    
    useEffect(() => {
        fetchRooms();
    }, [session]);
    
    const filtered = rooms.filter((room) =>
        room.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className='h-screen w-120 border-r border-gray-200 flex flex-col bg-white'>

            {/* Header */}
            <div className='px-4 py-4 border-gray-200'>
                <div className='flex items-center justify-between mb-3'>
                    <h2 className='text-xl font-semibold text-gray-900 mb-3'>Chats</h2>
                    <CreateRoom onRoomCreated={fetchRooms}/>
                </div>

                {/* Search bar */}
                <div className='flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2'>
                    <svg className='w-4 h-6 text-gray-400' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
                        <circle cx='11' cy='11' r='8'/><line x1='21' y1='21' x2='16.65' y2='16.65'/>
                    </svg>
                    <input
                        type='text'
                        placeholder='Search or start a new chat'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        suppressHydrationWarning
                        className='bg-transparent text-sm text-gray-600 outline-none w-full placeholder:text-gray-400'
                    />
                </div>
            </div>

            {/* Filter tabs */}
            <div className='flex items-center gap-2 px-5 py-1 border-gray-100'>
                {['All', 'Unread', 'Groups'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        suppressHydrationWarning
                        className={`px-3 py-2 rounded-full text-xs font-medium transition-all hover:cursor-pointer
                            ${activeTab === tab
                                ? 'bg-gray-900 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }
                        `}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Room list */}
            <div className='flex-1 overflow-y-auto'>
                {filtered.length === 0 ? (
                    <div className='flex items-center justify-center h-full text-sm text-gray-400'>
                        No chats found
                    </div>
                ) : (
                    filtered.map((room) => (
                        <div
                            key={room.id}
                            className='flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-all'
                        >
                            {/* Avatar */}
                            <div className='w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-sm flex-shrink-0'>
                                {room.name.charAt(0).toUpperCase()}
                            </div>

                            {/* Room info */}
                            <div className='flex-1 min-w-0'>
                                <div className='flex items-center justify-between mb-1'>
                                    <span className='text-sm font-medium text-gray-900'>{room.name}</span>
                                    <span className='text-xs text-gray-400'>
                                        {room.updatedAt ? new Date(room.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                    </span>
                                </div>
                                <span className='text-xs text-gray-500 truncate block'>
                                    {room.lastMessage ?? 'No messages yet'}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    )
}