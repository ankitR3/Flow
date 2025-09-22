'use client'

import { useUserSessionStore } from '@/src/store/useUserSessionStore';
import SearchBar from '@/src/utility/SearchBar';
import TitleDescription from '@/src/utility/TitleDescription';
import Image from 'next/image';

export default function DashboardHome() {
    const { session } = useUserSessionStore();

    return (
        <div className='h-full w-full flex flex-col p-4 space-y-4'>
            <div className='w-full flex justify-end items-center pr-10'>
                <SearchBar />
            </div>

            <div className='flex w-full h-full space-x-4 overflow-hidden'>
                {session && (
                    <div>
                        Welcome back, {session.user?.name || 'User'}!
                    </div>
                )}
                <div className='relative w-full h-[60vh] rounded-3xl overflow-hidde'>
                    <Image
                        src='gathering.png'
                        alt='Gathering'
                        fill
                        unoptimized
                        className="object-cover z-0"
                    />
                    <div className='absolute inset-0 bg-black/40 z-10'/>
                </div>
                <div>
                    <div>
                        <TitleDescription 
                            title='Friends'
                            tooltipActive={true}
                            tooltipContent='All your friends are shown here'
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}