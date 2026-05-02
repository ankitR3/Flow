'use client'

import { useDashboardStore } from '@/src/store/useDashboardStore';
import { DashboardEnum } from '@/src/types/DashboardEnum';
import ChatPanel from '../chat/ChatPanel';

export default function middleContentbar() {
    const { activeTab } = useDashboardStore();

    if (activeTab === DashboardEnum.EXPLORE) {
        return (
            <div className='h-screen w-120 border-r border-gray-200 flex items-center justify-center bg-white'>
                <p className='text-gray-400 text-sm'>Explore coming soon</p>
            </div>
        )
    }

    if (activeTab === DashboardEnum.SETTINGS) {
        return (
            <div className='h-screen w-120 border-r border-gray-200 flex items-center justify-center bg-white'>
                <p className='text-gray-400 text-sm'>Settings coming soon</p>
            </div>
        )
    }

    return <ChatPanel />
}