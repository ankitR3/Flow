import prisma from '@repo/db';
import { Request, Response } from 'express';

export default async function getRoomCheck(req: Request, res: Response) {
    const { roomId } = req.params;

    if (!roomId) {
        res.status(400).json({
            message: 'roomId not found'
        });
        return;
    }

    try {
        const room = await prisma.room.findUnique({
            where: { id: String(roomId) },
            select: {
                id: true,
                name: true,
                description: true,
                isPrivate: true,
                owner: true
            },
        });

        if (!room) {
            res.status(404).json({
                message: 'Room not found'
            });
            return;
        }

        res.status(200).json({ room });
        return;
    } catch (err) {
        console.log('get-Room-check Error: ', err);
        res.status(500).json({
            message: 'Failed to fetch room'
        });
        return;
    }
}