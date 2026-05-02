import { Request, Response } from 'express';
import prisma from '@repo/db';
import bcrypt from 'bcryptjs';

export default async function joinRoomController(req: Request, res: Response) {
    const { userId, roomId, password } = req.body;

    if (!roomId || !userId) {
        return res.status(400).json({
            message: 'user_id and room_id are required'
        });
    }

    try {
        const existingRoom = await prisma.room.findUnique({
            where: {
                id: roomId
            },
        });

        if (!existingRoom) {
            return res.status(404).json({
                message: 'room not found'
            });
        }

        if (existingRoom.isPrivate) {
            const isPasswordValid = await bcrypt.compare(password || '', existingRoom.password || '');
            if (!isPasswordValid) {
                return res.status(401).json({
                    message: 'Invalid password'
                });
            }
        }

        const alreadyJoined = await prisma.roomMember.findFirst({
            where: {
                userId,
                roomId
            },
        });

        if (alreadyJoined) {
            return res.status(409).json({
                message: 'Already a member of this room'
            });
        }

        await prisma.roomMember.create({
            data: {
                user: {
                    connect: {
                        id: userId
                    }
                },
                room: {
                    connect: {
                        id: roomId
                    }
                },
                role: 'MEMBER',
            },
        });

        return res.status(201).json({
            success: true,
            roomUrl: `/room/${roomId}`,
            message: 'room joined successfully'
        });
    } catch (err) {
        console.log('Join Room Error: ', err);
        return res.status(500).json({
            success: false,
            message: 'Room join failed'
        });
    }
}