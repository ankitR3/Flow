import { create } from 'zustand';
import { DashboardEnum } from '../types/DashboardEnum';

interface DashboardStore {
    activeTab: DashboardEnum;
    setActiveTab: (tab: DashboardEnum) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
    activeTab: DashboardEnum.CHATS,
    setActiveTab: (tab) => set({ activeTab: tab }),
}));