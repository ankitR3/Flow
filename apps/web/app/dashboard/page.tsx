'use client'

import LeftSidebar from '@/src/components/layout/LeftSidebar';
import MiddleContentbar from '@/src/components/layout/MiddleContentbar';
import RightChatContent from '@/src/components/layout/RightChatContent';

export default function DashboardPage() {
    return (
        <div className='flex h-screen w-screen'>
            <LeftSidebar />
            <MiddleContentbar />
            <RightChatContent />
        </div>
    )
}