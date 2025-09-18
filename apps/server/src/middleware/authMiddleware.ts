import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            message: 'unauthorized'
        });
        return;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        res.status(500).json({
            message: 'jwt-secret not found'
        });
        return;
    }

    if (!token) {
        res.status(500).json({
            message: 'token not found'
        });
        return;
    }

    try {
        jwt.verify(token, secret, (err) => {
            if (err) {
                res.status(401).json({
                    message: 'You are not authorized'
                });
                return;
            }
            next();
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Authorization failed'
        });
        return;
    }
}