"use client";

import React, { useState } from "react";
import ToolTipComponent from "./ToolTipComponent";
import { Copy, Check, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
    DELETE_ROOM_URL,
    LEAVE_ROOM_URL,
} from "@/routes/api-routes";
import { useUserSessionStore } from "../store/useUserSessionStore";
import DeleteConfirmationModal from "./DeleteConfirmationModel";

interface RoomCardProps {
    name: string;
    description: string;
    isOwner: boolean;
    roomId: string;
}

const RoomCard: React.FC<RoomCardProps> = ({
    name,
    description,
    isOwner,
    roomId,
}) => {
    const [copied, setCopied] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const { session } = useUserSessionStore();

    const handleCopy = async () => {
        await navigator.clipboard.writeText(roomId);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    async function handleDeleteOrLeave() {
        try {
            if (!session?.user?.token || !session?.user.id) return;

            const config = {
                headers: {
                    Authorization: `Bearer ${session.user.token}`,
                },
                data: {
                    roomId,
                    userId: session.user.id,
                },
            };

            if (isOwner) {
                await axios.delete(DELETE_ROOM_URL, config);
            } else {
                await axios.delete(LEAVE_ROOM_URL, config);
            }
        } catch (err: any) {
            console.error("Error deleting/leaving room:", err.response?.data || err.message);
        } finally {
            setShowModal(false);
        }
    }

    return (
        <>
            <div className="relative w-full border border-neutral-500 dark:border-muted rounded-xl px-4 py-3 shadow-sm bg-neutral-300 dark:bg-background mb-4 min-h-[100px]">

                <div className="absolute top-3 right-3">
                    <ToolTipComponent content={isOwner ? "YOU ARE THE ADMIN" : "YOU ARE A MEMBER"}>
                        <span
                            className={`text-[10px] font-sans px-3 py-1 rounded-full border ${isOwner
                                ? "bg-[#B9E741]/10 border-[#B9E741]/60 text-[#b8e741dc]"
                                : "bg-[#098fb1]/10 border-[#098fb1]/60 text-[#098fb1]"
                                }`}
                        >
                            {isOwner ? "ADMIN" : "MEMBER"}
                        </span>
                    </ToolTipComponent>
                </div>

                <div className="w-[80%] flex flex-col justify-between">
                    <div>
                        <h3 className="text-[17px] font-semibold text-neutral-900 dark:text-neutral-300">
                            {name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{description}</p>
                    </div>

                    <div className="flex items-center mt-2 space-x-2">
                        <p className="text-xs text-muted-foreground">
                            ID: <span className="font-mono">{roomId.slice(0, 6)}...</span>
                        </p>

                        <ToolTipComponent content={copied ? "Copied!" : "Copy"}>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                                onClick={handleCopy}
                            >
                                {copied ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </ToolTipComponent>
                    </div>
                </div>

                <div className="absolute bottom-3 right-3">
                    <ToolTipComponent content={isOwner ? "Delete Room" : "Leave Room"}>
                        <Button
                            size="icon"
                            className="h-8 w-8 text-red-500/80 dark:bg-transparent dark:hover:bg-red-900/20 p-2"
                            onClick={() => setShowModal(true)}
                        >
                            <Trash className="h-4 w-4 m-2" />
                        </Button>
                    </ToolTipComponent>
                </div>
            </div>

            {showModal && (
                <DeleteConfirmationModal
                    openDeleteModal={showModal}
                    setOpenDeleteModal={setShowModal}
                    onConfirm={handleDeleteOrLeave}
                />
            )}
        </>
    );
};

export default RoomCard;