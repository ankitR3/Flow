'use client'

import { Dispatch, SetStateAction } from "react";
import BlurBG from "./BlurBG";
import LogoutCard from "./LogoutCard";

interface LogoutModelProps {
    openLogoutModel: boolean;
    setOpenLogoutModel: Dispatch<SetStateAction<boolean>>;
}

export default function LogoutModel({ openLogoutModel, setOpenLogoutModel}: LogoutModelProps) {
    if (!openLogoutModel) {
        return null;
    }

    return (
        <BlurBG onBackgroundClick={() => setOpenLogoutModel}>
            <LogoutCard onCancel={() => setOpenLogoutModel(false)} />
        </BlurBG>
    )
}