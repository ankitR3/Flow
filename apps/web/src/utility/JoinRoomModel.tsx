"use client";

import { Dispatch, SetStateAction } from "react";
import BlurBG from "./BlurBG";
import JoinCard from "./JoinRoomCard";

interface JoinRoomModalProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    onJoinSuccess: () => void;
}

export default function JoinRoomModal({ isOpen, setIsOpen, onJoinSuccess }: JoinRoomModalProps) {
    if (!isOpen) return null;

    return (
        <BlurBG onBackgroundClick={() => setIsOpen(false)}>
            <JoinCard
                onCancel={() => setIsOpen(false)}
                onJoinSuccess={() => {
                    onJoinSuccess()
                    setIsOpen(false)
                }}
            />
        </BlurBG>
    );
}