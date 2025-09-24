import prisma from '@repo/db';
import { Request, Response } from 'express';

export default async function getMessages(req: Request, res: Response) {
    const { roomId } = req.query;

    if (!roomId || typeof roomId != 'string') {
        res.status(400).json({
            message: 'Insufficient or invalid roomId'
        });
        return;
    }

    try {
        const messages = await prisma.message.findMany({
            where: { roomId },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true,
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        });

        res.status(200).json({
            message: 'Fetched messages successfully'
        });
        return;
    } catch (err) {
        console.log('Get Message Error: ', err);
        res.status(500).json({
            message: 'Failed to fetch messages'
        })
        return;
    }
}