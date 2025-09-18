import prisma from '../../../../../packages/db';
import { Request, Response } from 'express';

export default async function leaveRoom(req: Request, res: Response) {
    const { roomId, userId } = req.body;

    try {
        await prisma.roomMember.delete({
            where: {
                userId_roomId: {
                    userId: String(userId),
                    roomId: roomId,
                }
            }
        })

        res.status(201).json({
            message: 'Room left successfully'
        });
        return;
    } catch (err) {
        console.log('Leave Room Error: ', err);
        res.status(500).json({
            message: 'Room leave failed'
        });
        return;
    }
}