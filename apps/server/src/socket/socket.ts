import { WebSocketServer } from 'ws';
import WebSocket from 'ws';
import { Server as HTTPServer} from 'http';
import { MessageType, SocketType } from './socket.types';

class WebSocketClass {
    private wss: WebSocketServer;
    private wsConnection: Map<string, Set<WebSocket>>;

    constructor(server: HTTPServer) {
        this.wss = new WebSocketServer({ server })
        this.wsConnection = new Map();
        this.init();
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
                
                case MessageType.ROOM_DELETED:
                    return this.broadcastGlobal(socketMessage);

                case MessageType.ROOM_JOINED:
                    return this.broadcastGlobal(socketMessage);

                case MessageType.ROOM_EXIT:
                    return this.broadcastGlobal(socketMessage);

                default:
                    console.log('Unknown message type:', socketMessage);
            }
        } catch (err) {
            console.log('Failed to parse message:', err);
        }
    }

    private handleSubscribe(
        subscribe: Extract<SocketType, { type: MessageType.SUBSCRIBE }>, socket: WebSocket
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

            console.log(`User ${payload.userId} subscribed to room ${roomId}`);

            socket.send(JSON.stringify({
                type: 'SUBSCRIBED',
                roomId,
                success: true
            }));
        } catch (err) {
            console.log('room-join error: ', err);
        }
    }

    private handleUnsubscribe(
        unsubscribe: Extract<SocketType, { type: MessageType.UNSUBSCRIBE}>, socket: WebSocket
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
                type: 'UNSUBSCRIBED',
                roomId,
                success: true
            }));
        } catch (err) {
            console.log('room disconnection failed: ', err);
        }
    }

    private handleChat(
        chat: Extract<SocketType, { type: MessageType.CHAT}>, socket: WebSocket
    ) {
        try {
            const { roomId, payload } = chat;

            if (!roomId) {
                console.log('roomId is required for chat messages');
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

            room.forEach((s) => {
                if (s.readyState === WebSocket.OPEN) {
                    s.send(sendMessage);
                }
            });

            console.log(`Message sent to room ${roomId} by ${payload.senderId}`);
        } catch (err) {
            console.log('chat message error: ', err);
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

    private broadcastGlobal(message: SocketType) {
        const payload = JSON.stringify(message);

        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(payload)
            }
        })
    }
}

export default WebSocketClass;