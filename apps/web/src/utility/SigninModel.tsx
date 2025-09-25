'use client'

import { Dispatch, SetStateAction } from "react";
import BlurBG from "./BlurBG";
import SigninCard from "./SigninCard";


interface LoginModelProps {
    openSigninModal: boolean;
    setOpenSigninModal: Dispatch<SetStateAction<boolean>>;
}

export default function SigninModal({
    openSigninModal,
    setOpenSigninModal,
}: LoginModelProps) {
    if (!openSigninModal) {
        return null;
    }

    return (
        <BlurBG>
            <SigninCard />
        </BlurBG>
    );
}