import prisma from '@repo/db';
import { Request, Response } from 'express';

export default async function getRoom(req: Request, res: Response) {
    const userId = req.query.userId as string;

    if (!userId) {
        res.status(400).json({
            message: 'USER_ID is required'
        });
        return;
    }

    try {
        const ownerRooms = await prisma.room.findMany({
            where: { ownerId: userId },
            include: {
                owner: true,
                members: {
                    include: {
                        user: true
                    },
                },
            },
        });

        const memberRooms = await prisma.roomMember.findMany({
            where: { userId: userId },
            include: {
                room: {
                    include: {
                        owner: true,
                        members: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
        });

        const joinedRooms = memberRooms
            .map((member) => member.room)
            .filter((room) => room.owner.id !== userId);

            res.status(200).json({
                ownerRooms,
                joinedRooms,
                mesaage: 'listed rooms successfully'
            });
            return;
    } catch (err) {
        console.log('Failed to fetch user room: ', err);
        res.status(500).json({
            message: 'Internal server error'
        });
        return;
    }
}