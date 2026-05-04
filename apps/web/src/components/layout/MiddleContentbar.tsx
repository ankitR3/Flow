'use client'

import { useDashboardStore } from '@/src/store/useDashboardStore';
import { DashboardEnum } from '@/src/types/DashboardEnum';
import ChatPanel from '../chat/ChatPanel';
import SettingsBase from '../settings/SettingsBase';
import JoinRoom from '../room/JoinRoom';

export default function middleContentbar() {
    const { activeTab } = useDashboardStore();

    switch (activeTab) {
        case DashboardEnum.CHATS:
            return <ChatPanel />
        case DashboardEnum.EXPLORE:
            return <JoinRoom onRoomJoined={() => {}} />;
        case DashboardEnum.SETTINGS:
            return <SettingsBase />
    }
}