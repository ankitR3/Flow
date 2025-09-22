'use client'

import HeadingCard from './HeadingCard';
import NavButton from '../navbars/NavButton';
import { BiHome } from 'react-icons/bi';
import { FiPlus, FiLogOut } from 'react-icons/fi';
import { CgProfile } from 'react-icons/cg';
import { MdGroups } from 'react-icons/md';
import { TbSettings2 } from 'react-icons/tb';
import { useDashboardNavStore } from '@/src/store/useDashboardNavStore';
import { DashboardNavEnum } from '@/src/types/DashboardNavEnum';
import { Button } from '@/components/ui/button';

export default function DashboardLeft() {
    const { value, setValue } = useDashboardNavStore();

    const handleLogout = () => {
        // Add your logout logic here
        console.log('Logging out...');
    };

    return (
        <div className='h-[90%] w-[16%] border rounded-3xl flex flex-col justify-between p-4'>
            <div className='space-y-3'>
                <NavButton 
                    title='Home'
                    logo={<BiHome />}
                    setState={() => setValue(DashboardNavEnum.HOME)}
                    isActive={value === DashboardNavEnum.HOME}
                />

                <NavButton 
                    title='Create Room'
                    logo={<FiPlus />}
                    setState={() => setValue(DashboardNavEnum.CREATE_ROOM)}
                    isActive={value === DashboardNavEnum.CREATE_ROOM}
                />

                <NavButton 
                    title='My Rooms'
                    logo={<MdGroups />}
                    setState={() => setValue(DashboardNavEnum.MY_ROOMS)}
                    isActive={value === DashboardNavEnum.MY_ROOMS}
                />

                <NavButton 
                    title='Profile'
                    logo={<CgProfile />}
                    setState={() => setValue(DashboardNavEnum.PROFILE)}
                    isActive={value === DashboardNavEnum.PROFILE}
                />

                <NavButton 
                    title='Settings'
                    logo={<TbSettings2 />}
                    setState={() => setValue(DashboardNavEnum.SETTINGS)}
                    isActive={value === DashboardNavEnum.SETTINGS}
                />
            </div>
        </div>
    );
}