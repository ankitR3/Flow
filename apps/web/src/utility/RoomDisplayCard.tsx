"use client";

import { useEffect, useState } from "react";
import { useUserSessionStore } from "../store/useUserSessionStore";
import axios from "axios";
import { GET_ROOM_URL } from "@/routes/api-routes";
import RoomCard from "./RoomCard";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import JoinRoomModal from "./JoinRoomModel";

interface Room {
    id: string;
    name: string;
    description: string;
    isPrivate: boolean;
    owner: {
        id: string;
        name: string;
    };
}

interface RoomCheckResponse {
    room: {
        id: string;
        name: string;
        description: string;
        isPrivate: boolean;
    };
}

export default function RoomDisplayCard() {
    const { session } = useUserSessionStore();
    const [ownedRooms, setOwnedRooms] = useState<Room[]>([]);
    const [joinedRooms, setJoinedRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);

    // Join room states
    const [showJoinPanel, setShowJoinPanel] = useState<boolean>(false);
    const [inputRoomId, setInputRoomId] = useState<string>("");
    const [roomCheckError, setRoomCheckError] = useState<string | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<RoomCheckResponse["room"] | null>(null);
    const [showJoinModal, setShowJoinModal] = useState(false);

    useEffect(() => {
        const fetchRooms = async () => {
            if (!session?.user?.id) return;

            try {
                const response = await axios.get(GET_ROOM_URL, {
                    params: { userId: session.user.id },
                    headers: {
                        Authorization: `Bearer ${session.user.token}`,
                    },
                });

                const { ownedRooms, joinedRooms } = response.data;

                const filteredJoinedRooms = joinedRooms.filter(
                    (joinedRoom: Room) =>
                        !ownedRooms.some((owned: Room) => owned.id === joinedRoom.id)
                );

                setOwnedRooms(ownedRooms || []);
                setJoinedRooms(filteredJoinedRooms || []);
            } catch (error) {
                console.error("Error fetching rooms:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [session?.user?.id]);

    const handleJoinClick = () => {
        console.log(session?.user?.token)
        console.log("isnide handle join")
        setShowJoinModal(true)
    }

    const handleJoinSuccess = () => {
        setShowJoinModal(false);
        setSelectedRoom(null);
        setInputRoomId("");
        setShowJoinPanel(false);
        setRoomCheckError(null);
    };

    const allRooms = [...(ownedRooms ?? []), ...(joinedRooms ?? [])];

    return (
        <div className="w-full mx-auto flex flex-col h-[600px]">

            <div className="mb-4 space-y-2 px-0.5">
                <div
                    onClick={() => {
                        setShowJoinPanel(true);
                        setInputRoomId("");
                        setRoomCheckError(null);
                    }}
                    className="cursor-pointer font-mono flex items-center justify-between border dark:border-[#3593b8] bg-[#00161a] rounded-xl p-4 hover:bg-[#00161ad8] transition">
                    <div onClick={handleJoinClick} className="w-full flex items-center justify-center gap-2">
                        <Plus className="w-5 h-5 dark:text-[#3593b8]" />
                        <span className="font-medium dark:text-[#3593b8]">JOIN A ROOM</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-hide">
                {allRooms.length > 0 ? (
                    allRooms.map((room) => (
                        <RoomCard
                            key={room.id}
                            name={room.name}
                            description={room.description}
                            isOwner={room.owner.id === session?.user?.id}
                            roomId={room.id}
                        />
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground mb-4">
                        You are not in any rooms yet.
                    </p>
                )}
            </div>



            {showJoinModal && (
                <JoinRoomModal
                    isOpen={showJoinModal}
                    setIsOpen={setShowJoinModal}
                    onJoinSuccess={handleJoinSuccess}
                />
            )}
        </div>
    );
}