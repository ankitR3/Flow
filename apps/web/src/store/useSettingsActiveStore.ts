import { create } from "zustand";
import { SettingsRendererEnum } from "../types/SettingsRendererEnum";

interface SettingsActiveStoreTypes {
    value: SettingsRendererEnum;
    setValue: (data: SettingsRendererEnum) => void;
}

export const useSettingsRendererStore = create<SettingsActiveStoreTypes>((set) => ({
    value: SettingsRendererEnum.CHANGE_THEME,
    setValue: (data: SettingsRendererEnum) => set({ value: data })
}))