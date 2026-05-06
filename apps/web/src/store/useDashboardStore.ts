import { create } from 'zustand';
import { DashboardEnum } from '../types/DashboardEnum';

interface Room {
    id: string;
    name: string;
    code: string;
    ownerId: string;
    lastMessage?: string;
    updatedAt?: string;
}

interface DashboardStore {
    activeTab: DashboardEnum;
    setActiveTab: (tab: DashboardEnum) => void;
    selectedRoom: Room | null;
    setSelectedRoom: (room: Room | null) => void;
    refreshRooms: number;
    triggerRefresh: () => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
    activeTab: DashboardEnum.CHATS,
    setActiveTab: (tab) => set({ activeTab: tab }),
    selectedRoom: null,
    setSelectedRoom: (room) => set({
        selectedRoom: room
    }),
    refreshRooms: 0,
    triggerRefresh: () => set((state) => ({
        refreshRooms: state.refreshRooms + 1
    })),
}));