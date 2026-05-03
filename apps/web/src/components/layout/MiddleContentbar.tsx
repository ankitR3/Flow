'use client'

import { useDashboardStore } from '@/src/store/useDashboardStore';
import { DashboardEnum } from '@/src/types/DashboardEnum';
import ChatPanel from '../chat/ChatPanel';
import SettingsBase from '../settings/SettingsBase';

export default function middleContentbar() {
    const { activeTab } = useDashboardStore();

    switch (activeTab) {
        case DashboardEnum.CHATS:
            return <ChatPanel />
        case DashboardEnum.EXPLORE:
            return null;
        case DashboardEnum.SETTINGS:
            return <SettingsBase />
    }
}