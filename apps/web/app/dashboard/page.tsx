'use client'

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LeftSidebar from '@/src/components/layout/LeftSidebar';
import MiddleContentbar from '@/src/components/layout/MiddleContentbar';
import RightChatContent from '@/src/components/layout/RightChatContent';

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace('/');
        }
    }, [status]);

    if (status === 'loading') {
        return (
            <div className='flex h-screen w-screen items-center justify-center'>
                <p className='text-gray-400 text-sm'>Loading...</p>
            </div>
        )
    }

    if (!session) return null;

    return (
        <div className='flex h-screen w-screen'>
            <LeftSidebar />
            <MiddleContentbar />
            <RightChatContent />
        </div>
    )
}