'use client'

import { useDashboardNavStore } from '@/src/store/useDashboardNavStore';
import { DashboardNavEnum } from '@/src/types/DashboardNavEnum';
import DashboardHome from './DashboardHome';
import DashboardCreateRoom from './DashboardCreateRoom';
import DashboardProfile from './DashboardProfile';
// import DashboardSettings
import DashboardMyRooms from './DashboardMyRoom';

export default function DashboardRight() {
    
    function handleRightSection() {
        const { value } = useDashboardNavStore();

        switch (value) {
            case DashboardNavEnum.HOME:
                return <DashboardHome />
            case DashboardNavEnum.CREATE_ROOM:
                return <DashboardCreateRoom />
            case DashboardNavEnum.MY_ROOMS:
                return <DashboardMyRooms />
            case DashboardNavEnum.PROFILE:
                return <DashboardProfile />
            // case DashboardNavEnum.SETTINGS:
            //     return <DashboardSettings />
        }
    }

    return (
        <div className='max-h-[90%] w-[80%]'>
            {handleRightSection()}
        </div>
    )
}