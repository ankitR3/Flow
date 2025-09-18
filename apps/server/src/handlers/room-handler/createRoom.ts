import prisma from '../../../../../packages/db';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

export default async function createRoom(req: Request, res: Response) {
    const { userId, name, description, isPrivate, password} = req.body;

    try {
        console.log('inside room creation', req.body);

        const hashedPassword = isPrivate && password ? await bcrypt.hash(password, 10): null;

        const room = await prisma.room.create({
            data: {
                name,
                description,
                isPrivate,
                password: hashedPassword,
                owner: {
                    connect: { id: userId },
                },
                members: {
                    create: {
                        user: {
                            connect: { id: userId },
                        },
                        role: 'OWNER',
                    },
                },
            },
        });

        res.status(201).json({
            success: true,
            room,
            roomUrl: `/room/${room.id}`,
            message: 'Room created successfully',
        });
    } catch (err) {
        console.log('Create Room Error: ', err);
        res.send(500).json({
            success: false,
            message: 'Room creation failed'
        });
        return;
    }
}