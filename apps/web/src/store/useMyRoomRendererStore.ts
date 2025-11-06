import { create } from "zustand";
import { MyRoomRendererEnum } from "../types/MyRoomRendererEnum";

interface MyRoomRendererStoreTypes {
    value: MyRoomRendererEnum;
    setValue: (data: MyRoomRendererEnum) => void;
}

export const useMyRoomRendererStore = create<MyRoomRendererStoreTypes>((set) => ({
    value: MyRoomRendererEnum.ALL_ROOMS,
    setValue: (data: MyRoomRendererEnum) => set({ value: data })
}))