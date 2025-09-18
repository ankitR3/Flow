import prisma from '../../../../../packages/db';
import { Request, Response} from 'express';

export default async function sendMessage(req: Request, res: Response) {
    const { roomId, content, userId } = req.body;

    if (!roomId || !content || !userId) {
        res.status(400).json({
            message: 'Insufficient data'
        });
        return;
    }

    try {
        const message = await prisma.message.create({
            data: {
                content,
                author: {
                    connect: { id: userId }
                },
                room: {
                    connect: { id: roomId }
                },
            },
            include: {
                author: true,
            }
        });

        res.status(201).json({
            message: 'Sent message successfully'
        });
        return;
    } catch (err) {
        console.log('Send Message Error: ', err);
        res.status(500).json({
            message: 'Failed to send message'
        });
        return;
    }
}