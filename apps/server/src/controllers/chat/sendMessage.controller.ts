import { Request, Response } from 'express';
import prisma from '@repo/db';
import { isRateLimited } from '../../redis/redisRateLimit';
import { invalidateCache } from '../../redis/redisCache';
import { publisher } from '../../redis/redisClient';

export default async function sendMessageController(req: Request, res: Response) {
    const { roomId, content, userId } = req.body;

    if (!roomId || !content || !userId) {
        return res.status(400).json({
            message: 'insufficient data'
        });
    }

    try {
        const limited = await isRateLimited(userId);
        if (limited) {
            return res.status(429).json({
                message: 'too may messages - slow down'
            });
        }
        
        const room = await prisma.room.findUnique({
            where: {
                id: roomId
            }
        });

        if (!room) {
            return res.status(404).json({
                message: 'Room not found'
            });
        }

        const message = await prisma.message.create({
            data: {
                content,
                author: {
                    connect: {
                        id: userId
                    }
                },
                room: {
                    connect: {
                        id: roomId
                    }
                },
            },
            include: {
                author: true,
            }
        });

        // Invalidate message cache
        await invalidateCache(roomId);

        // Broadcast to WebSocket clients via Redis publisher
        try {
            const socketMessage = JSON.stringify({
                type: 'CHAT',
                roomId,
                payload: {
                    message: content,
                    senderId: userId,
                    senderName: message.author.name,
                    timestamp: message.createdAt.toISOString()
                }
            });
            await publisher.publish('broadcast_room', socketMessage);
        } catch (redisErr) {
            console.log('Redis publish error in HTTP send-message: ', redisErr);
        }

        return res.status(201).json({
            data: message,
            message: 'sent message successfully'
        });
    } catch (err) {
        console.log('send-message error: ', err);
        return res.status(500).json({
            message: 'failed to send message'
        });
    }
}