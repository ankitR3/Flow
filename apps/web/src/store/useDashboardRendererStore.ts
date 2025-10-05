import { create } from 'zustand';
import { DashboardRendererEnum } from '../types/DashboardRendererEnum';

interface DashboardRendererStoreTypes {
    value: DashboardRendererEnum;
    setValue: (data: DashboardRendererEnum) => void;
}

export const useDashboardRendererStore = create<DashboardRendererStoreTypes>((set) => ({
    value: DashboardRendererEnum.HOME,
    setValue: (data: DashboardRendererEnum) => set({ value: data })
}))