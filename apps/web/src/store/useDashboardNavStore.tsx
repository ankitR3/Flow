import { create } from 'zustand';
import { DashboardNavEnum } from '../types/DashboardNavEnum';

interface DashboardNavStoreTypes {
    value: DashboardNavEnum;
    setValue: (data: DashboardNavEnum) => void;
}

export const useDashboardNavStore = create<DashboardNavStoreTypes>((set) => ({
    value: DashboardNavEnum.HOME,
    setValue: (data: DashboardNavEnum) => set({ value: data })
}))