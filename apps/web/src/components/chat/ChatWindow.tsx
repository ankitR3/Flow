'use client'

import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/src/hooks/useSocket';
import { MessageType } from '@/src/types/socket.types';
import { useMessages } from '@/src/hooks/useMessages';
import { useSendMessage } from '@/src/hooks/useSendMessage';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import DeleteRoom from '../room/DeleteRoom';
import { useDashboardStore } from '@/src/store/useDashboardStore';

interface Room {
    id: string;
    name: string;
    code: string;
    ownerId: string;
    lastMessage?: string;
    updatedAt?: string;
}

interface ChatWindowProps {
    room: Room;
    onRoomDeleted: () => void;
}

export default function ChatWindow({ room, onRoomDeleted }: ChatWindowProps) {
    const { data: session } = useSession();
    const { messages, setMessages } = useMessages(room.id);
    const { saveMessage } = useSendMessage(room.id);
    const [copied, setCopied] = useState(false);
    const [input, setInput] = useState('');
    const { triggerRefresh, updateRoomLastMessage } = useDashboardStore();

    const userId = (session as any)?.user?.id ?? '';
    const username = (session as any)?.user?.name ?? 'someone';

    const handleMessage = useCallback((data: any) => {
        if (data.type === MessageType.CHAT) {
            setMessages((prev) => [...prev, data.payload]);
            updateRoomLastMessage(room.id, data.payload.message);
        }
        if (data.type === MessageType.ROOM_JOINED) {
            setMessages((prev) => [...prev, {
                id: Date.now().toString(),
                senderId: 'system',
                message: `${data.payload.username} joined the room`,
                timestamp: new Date().toISOString(),
                type: 'system'
            }]);
            triggerRefresh();
        }
        if (data.type === MessageType.ROOM_EXIT) {
            setMessages((prev) => [...prev, {
                id: Date.now().toString(),
                senderId: 'system',
                message: `${data.payload.username} left the room`,
                timestamp: new Date().toISOString(),
                type: 'system'
            }]);
            triggerRefresh();
        }
    }, [triggerRefresh, updateRoomLastMessage]);

    const { sendMessage } = useSocket({
        roomId: room.id,
        userId,
        username,
        onMessage: handleMessage,
    });

    function copyCode() {
        navigator.clipboard.writeText(room.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    async function handleSend() {
        if (!input.trim()) return;
        sendMessage(input);
        await saveMessage(input);
        triggerRefresh();
        setInput('');
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') handleSend();
    }

    return (
        <div className='flex-1 flex flex-col bg-white'>
            {/* Header */}
            <div className='flex items-center gap-3 px-4 py-3 border-b border-gray-200'>
                <div className='w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-sm'>
                    {room.name.charAt(0).toUpperCase()}
                </div>
                <div className='flex-1'>
                    <p className='text-sm font-medium text-gray-900'>{room.name}</p>
                    {/* Code with copy button */}
                    <div className='flex items-center gap-1'>
                        <p className='text-xs text-gray-400 font-mono'>{room.code.slice(0, 3)}***</p>
                        <button
                            onClick={copyCode}
                            title='Copy room code'
                            className='text-gray-400 hover:text-gray-600 transition-all'
                        >
                            <svg className='w-3 h-3' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
                                <rect x='9' y='9' width='13' height='13' rx='2' ry='2'/>
                                <path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'/>
                            </svg>
                        </button>
                        {copied && (
                            <span className='text-xs text-blue-500'>copied</span>
                        )}
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='p-2 rounded-full hover:bg-gray-100 transition-all'>
                            <EllipsisVerticalIcon className='w-5 h-5 text-black' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='bg-white' align='end'>
                        <DeleteRoom
                            roomId={room.id}
                            roomName={room.name}
                            ownerId={room.ownerId}
                            onRoomDeleted={onRoomDeleted}
                        />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Messages area */}
            <div className='flex-1 overflow-y-auto p-4 flex flex-col gap-2'>
                {messages.length === 0 ? (
                    <p className='text-center text-xs text-gray-400'>No messages yet. Say hello!</p>
                ) : (
                    messages.map((msg, index) => (
                        msg.type === 'system' ? (
                            <div key={index} className='flex justify-center'>
                                <span className='text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full'>
                                    {msg.message}
                                </span>
                            </div>
                        ) : (
                            <div
                                key={index}
                                className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`px-4 py-2 rounded-2xl max-w-xs text-sm
                                    ${msg.senderId === userId
                                        ? 'bg-gray-900 text-white rounded-br-sm'
                                        : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                                    }    
                                `}>
                                    {msg.message}
                                </div>
                            </div>
                        )
                    ))
                )}
            </div>

            {/* Input */}
            <div className='flex items-center gap-3 px-4 py-3 border-t border-gray-200'>
                <input
                    type='text'
                    placeholder='Type a message...'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className='flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm text-black outline-none placeholder:text-gray-400'
                />
                <button
                    onClick={handleSend}
                    className='w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0'
                >
                    <svg className='w-4 h-4 stroke-white fill-none' viewBox='0 0 24 24' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
                        <line x1='22' y1='2' x2='11' y2='13'/><polygon points='22 2 15 22 11 13 2 9 22 2' fill='white'/>
                    </svg>
                </button>
            </div>
        </div>
    )
}