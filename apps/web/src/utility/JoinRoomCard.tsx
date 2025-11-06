"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Lock, DoorOpen } from "lucide-react";
import { useUserSessionStore } from "../store/useUserSessionStore";
import { useState } from "react";
import { GET_ROOM_CHECK_URL, JOIN_ROOM_URL } from "@/routes/api-routes";
import { useWebSocket } from "../hooks/useSocket";

interface JoinCardProps {
    onCancel: () => void;
    onJoinSuccess: () => void;
}

export default function JoinCard({ onCancel, onJoinSuccess }: JoinCardProps) {

    const { session } = useUserSessionStore();
    const { subscribe } = useWebSocket();

    const [roomId, setRoomId] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [roomDetails, setRoomDetails] = useState<null | { isPrivate: boolean; name: string }>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [checkingRoom, setCheckingRoom] = useState<boolean>(false);

    const userId = session?.user?.id;


    async function fetchRoomDetails() {
        if (!roomId.trim()) {
            setError("Room ID is required");
            return;
        }

        setCheckingRoom(true);
        setError(null);
        setRoomDetails(null);

        try {
            const res = await axios.get(`${GET_ROOM_CHECK_URL}/${roomId}`, {
                headers: {
                    Authorization: `Bearer ${session?.user?.token}`,
                },
            });

            setRoomDetails(res.data.room);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to find room");
        } finally {
            setCheckingRoom(false);
        }
    }



    async function handleJoin() {
        console.log(session?.user?.token)
        if (!userId || !roomId) {
            setError("Missing user or room ID");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await axios.post( JOIN_ROOM_URL, {
                    userId,
                    roomId,
                    password: roomDetails?.isPrivate ? password : undefined,
                },
                {
                    headers: {
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                }
            );

            subscribe(roomId, userId);
            console.log(`Subscribe to room ${roomId}`);

            onJoinSuccess();

        } catch (err: any) {
            setError(err?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full font-sans max-w-[420px] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#161616] shadow-xl space-y-6">
            {!roomDetails ? (
                <>
                    <div className="text-center space-y-2 font-sans">
                        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-[#e2e2e2]">
                            Enter Room ID
                        </h2>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            We'll check if the room is public or private.
                        </p>
                    </div>

                    <Input
                        placeholder="room-id"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !checkingRoom) {
                                fetchRoomDetails();
                            }
                        }}
                        className="h-11 text-sm placeholder:font-mono placeholder:text-center"
                    />

                    {error && (
                        <p className="text-sm text-red-500 font-medium text-center">{error}</p>
                    )}

                    <div className="flex gap-4">
                        <Button
                            onClick={onCancel}
                            disabled={checkingRoom}
                            className="flex-1 dark:bg-red-500/60 dark:hover:bg-red-500/50 font-mono font-semibold"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={fetchRoomDetails}
                            disabled={checkingRoom || !roomId.trim()}
                            className="flex-1 dark:bg-[#cacacafb] text-black dark:hover:bg-[#c5c5c596] font-mono font-semibold"
                        >
                            {checkingRoom ? "Checking..." : "Continue"}
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <div className="text-center space-y-2 font-sans">
                        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                            Join <span className="text-[#e5ff52be]">"{roomDetails.name}"?</span>
                        </h2>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {roomDetails.isPrivate
                                ? "This room is private. Enter the password to join."
                                : "This is a public room. You can join directly."}
                        </p>
                    </div>

                    {roomDetails.isPrivate && (
                        <div>
                            <label className="block mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Password
                            </label>
                            <Input
                                type="password"
                                placeholder="Enter room password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !loading) {
                                        handleJoin();
                                    }
                                }}
                                className="h-11 text-sm placeholder:font-mono placeholder:text-center"
                            />
                        </div>
                    )}

                    {error && (
                        <p className="text-sm text-red-500 font-medium text-center">{error}</p>
                    )}

                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setRoomDetails(null);
                                setPassword("");
                                setError(null);
                            }}
                            disabled={loading}
                            className="flex-1 font-sans "
                        >
                            Back
                        </Button>

                        <Button
                            onClick={handleJoin}
                            disabled={loading || (roomDetails.isPrivate && !password.trim())}
                            className="flex-1 dark:bg-[#cacacafb] text-black dark:hover:bg-[#c5c5c596] font-mono font-semibold"
                        >
                            {loading ? "Joining..." : "Join Room"}
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}