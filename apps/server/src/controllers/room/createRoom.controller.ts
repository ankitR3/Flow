import { Request, Response } from 'express';
import prisma from '@repo/db';
import bcrypt from 'bcryptjs';

export default async function createRoomController(req: Request, res: Response) {
    const { userId, name, description, isPrivate, password } = req.body;

    if (!userId) {
        return res.status(401).json({
            message: 'authentication failed'
        });
    }

    if (!name) {
        return res.status(400).json({
            message: 'room name is required'
        });
    }

    if (!isPrivate && !password) {
        return res.status(400).json({
            message: 'password is required for private room'
        });
    }

    try {
        const hashedPassword = isPrivate && password ? await bcrypt.hash(password, 10): null;
        const room = await prisma.room.create({
            data: {
                name,
                description,
                isPrivate,
                password: hashedPassword,
                owner: {
                    connect: {
                        id: userId
                    }
                },
                members: {
                    create: {
                        user: {
                            connect: {
                                id: userId
                            }
                        },
                        role: 'OWNER'
                    },
                },
            },
        });

        return res.status(201).json({
            success: true,
            room,
            roomUrl: `/room/${room.id}`,
            message: 'room created successfully'
        });
    } catch (err) {
        console.log('create room error: ', err);
        return res.status(500).json({
            success: false,
            message: 'room creation failed'
        });
    }
}