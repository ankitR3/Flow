import { WebSocketServer } from 'ws';
import WebSocket from 'ws';
import { Server as HTTPServer } from 'http';
import { MessageType, SocketType } from './socket.types';
import prisma from '@repo/db';
import { publisher, subscriber } from '../redis/redisClient';
import { invalidateCache } from '../redis/redisCache';

class WebSocketClass {
    private wss: WebSocketServer;
    private wsConnection: Map<string, Set<WebSocket>>;

    constructor(server: HTTPServer) {
        this.wss = new WebSocketServer({ server });
        this.wsConnection = new Map();
        this.init();
        this.initRedis();
    }

    private init() {
        this.wss.on('connection', (socket) => {
            socket.on('message', (message) => {
                this.handleMessage(message.toString(), socket);
            });
            socket.on('close', () => {
                this.cleanupSocket(socket);
            });
        });
    }

    private initRedis() {
        subscriber.subscribe('broadcast_room', 'broadcast_global', (err) => {
            if (err) {
                console.log('Redis subscribe error: ', err);
            }
        });

        subscriber.on('message', (channel, message) => {
            const parsed: SocketType = JSON.parse(message);

            if (channel === 'broadcast_room') {
                this.broadcastToRoom(parsed);
            }

            if (channel === 'broadcast_global') {
                this.broadcastGlobal(parsed);
            }
        });
    }

    private handleMessage(message: string, socket: WebSocket) {
        try {
            const socketMessage: SocketType = JSON.parse(message);

            switch (socketMessage.type) {
                case MessageType.SUBSCRIBE:
                    return this.handleSubscribe(socketMessage, socket);

                case MessageType.UNSUBSCRIBE:
                    return this.handleUnsubscribe(socketMessage, socket);

                case MessageType.CHAT:
                    return this.handleChat(socketMessage, socket);

                case MessageType.ROOM_CREATED:
                    return this.broadcastGlobal(socketMessage);

                case MessageType.ROOM_JOINED:
                    return this.handleRoomJoined(socketMessage);

                case MessageType.ROOM_EXIT:
                    return this.handleRoomExit(socketMessage);

                case MessageType.ROOM_DELETED:
                    return this.broadcastGlobal(socketMessage);

                case MessageType.TYPING:
                    return this.broadcastToRoom(socketMessage);

                case MessageType.STOP_TYPING:
                    return this.broadcastToRoom(socketMessage);
            }
        } catch (err) {
            console.log('Failed to parse message:', err);
        }
    }

    private handleSubscribe(
        subscribe: Extract<SocketType, { type: MessageType.SUBSCRIBE }>,
        socket: WebSocket
    ) {
        try {
            const { roomId, payload } = subscribe;
            if (!roomId) {
                console.log('room-id not found');
                return;
            }

            if (!this.wsConnection.has(roomId)) {
                this.wsConnection.set(roomId, new Set<WebSocket>());
            }
            this.wsConnection.get(roomId)?.add(socket);

            console.log(`User ${payload.userId} subscribe to room ${roomId}`);

            socket.send(JSON.stringify({
                type: 'SUBSCRIBE',
                roomId,
                success: true
            }));
        } catch (err) {
            console.log('room-join error: ', err);
        }
    }

    private handleUnsubscribe(
        unsubscribe: Extract<SocketType, { type: MessageType.UNSUBSCRIBE }>,
        socket: WebSocket
    ) {
        try {
            const { roomId } = unsubscribe;
            if (!roomId) {
                console.log('room-id not found');
                return;
            }

            const room = this.wsConnection.get(roomId);
            if (!room || !room.has(socket)) {
                console.log('You are not in the room');
                return;
            }

            room.delete(socket);
            if (room.size == 0) {
                this.wsConnection.delete(roomId);
            }

            console.log(`User disconnected from the room ${roomId}`);

            socket.send(JSON.stringify({
                type: 'UNSUBSCRIBE',
                roomId,
                success: true
            }));
        } catch (err) {
            console.log('room disconnection failed: ', err);
        }
    }

    private async handleChat(
        chat: Extract<SocketType, { type: MessageType.CHAT }>,
        socket: WebSocket
    ) {
        try {
            const { roomId, payload } = chat;

            if (!roomId) {
                console.log('roomId is required for chat message');
                return;
            }

            const room = this.wsConnection.get(roomId);
            if (!room) {
                console.log(`No connection found for room ${roomId}`);
                return;
            }

            const sendMessage = JSON.stringify({
                type: MessageType.CHAT,
                roomId,
                payload: {
                    ...payload,
                    timeStamp: new Date().toISOString()
                }
            });

            await invalidateCache(roomId);
            await publisher.publish('broadcast_room', sendMessage);

            console.log(`Message send to room ${roomId}`);
        } catch (err) {
            console.log('chat message err: ', err);
        }
    }

    private async handleRoomJoined(
        message: Extract<SocketType, { type: MessageType.ROOM_JOINED }>
    ) {
        try {
            const { roomId, payload } = message;

            await prisma.message.create({
                data: {
                    roomId,
                    authorId: payload.userId,
                    content: `${payload.username} joined the room`,
                    type: 'SYSTEM',
                }
            });
            this.broadcastToRoom(message);
        } catch (err) {
            console.log('handleRoomJoined error:', err);
        }
    }

    private async handleRoomExit(
        message: Extract<SocketType, { type: MessageType.ROOM_EXIT }>
    ) {
        try {
            const { roomId, payload} = message;
            await prisma.message.create({
                data: {
                    roomId,
                    authorId: payload.userId,
                    content: `${payload.username} left the room`,
                    type: 'SYSTEM'
                }
            });
            this.broadcastToRoom(message);
        } catch (err) {
            console.log('handleRoomExit error: ', err);
        }
    }

    private cleanupSocket(socket: WebSocket) {
        this.wsConnection.forEach((room, roomId) => {
            if (room.has(socket)) {
                room.delete(socket);
                if (room.size === 0) {
                    this.wsConnection.delete(roomId);
                }
            }
        });
    }

    public getRoomStats() {
        const stats = new Map<string, number>();
        this.wsConnection.forEach((room, roomId) => {
            stats.set(roomId, room.size);
        });
        return stats;
    }

    private async broadcastGlobal(message: SocketType) {
        await publisher.publish('broadcast_global', JSON.stringify(message));
    }

    private broadcastToRoom(message: SocketType) {
        const room = this.wsConnection.get(message.roomId);
        if (!room) return;

        const payload = JSON.stringify(message);
        room.forEach((socket) => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(payload);
            }
        })
    } 
}

export default WebSocketClass;