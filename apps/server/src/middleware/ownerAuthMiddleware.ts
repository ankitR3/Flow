import { NextFunction, Request, Response } from 'express';
import prisma from '../../../../packages/db';

export default async function ownerAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.headers;
    const { roomId } = req.headers;

    try {
        if (!userId) {
            res.status(401).json({
                message: 'Authentication failed'
            });
            return;
        }

        const room = await prisma.room.findUnique({
            where: {
                id: String(roomId)
            }
        });

        if (!room) {
            res.status(404).json({
                message: 'Room not found'
            });
            return;
        }

        if (room.ownerId !== userId) {
            res.status(403).json({
                message: 'You are not the owner'
            });
            return;
        }
        next();

    } catch (err) {
        console.log(err);
        res.status(500).json({
            messgae: 'unauthorized'
        });
        return;
    }
}