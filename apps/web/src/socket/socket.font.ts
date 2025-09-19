import { IncomingMessageType, MessageHandler, SocketType, StatusHandler, WebSocketStatus } from "../types/socketTypes";


class WebSocketClient {
    private ws: WebSocket | null = null;
    private url: string;
    private messageHandlers: Set<MessageHandler> = new Set();
    private statusHandlers: Set<StatusHandler> = new Set();
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;
    private status: WebSocketStatus = WebSocketStatus.DISCONNECTED;

    constructor(url: string) {
        this.url = url;
    }

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {

            if (this.ws?.readyState === WebSocket.OPEN) {
                resolve();
                return;
            }

            this.setStatus(WebSocketStatus.CONNECTING);
            this.ws = new WebSocket(this.url);

            this.ws.onopen = () => {
                this.setStatus(WebSocketStatus.CONNECTED);
                this.reconnectAttempts = 0;
                resolve();
            };

            this.ws.onclose = () => {
                this.setStatus(WebSocketStatus.DISCONNECTED);
                this.handleReconnect();
            };

            this.ws.onerror = (error) => {
                this.setStatus(WebSocketStatus.ERROR);
                reject(error);
            };

            this.ws.onmessage = (event) => {
                try {
                    const message: SocketType = JSON.parse(event.data);
                    this.messageHandlers.forEach(handle => handle(message));
                } catch (error) {
                    console.error('Failed to parse WebSocket message: ', error);
                }
            };
        });
    }

    private setStatus(status: WebSocketStatus) {
        this.status = status;
        this.statusHandlers.forEach(handler => handler(status));
    }

    private handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => {
                this.connect().catch(console.error);
            }, this.reconnectDelay * this.reconnectAttempts);
        }
    }

    subscribe(roomId: string, userId: string) {
        this.send({
            type: IncomingMessageType.SUBSCRIBE,
            roomId,
            payload: { userId }
        });
    }

    unsubscribe(roomId: string) {
        this.send({
            type: IncomingMessageType.UNSUBSCRIBE,
            roomId
        });
    }

    sendChatMessage(roomId: string, message: string, senderId: string) {
        this.send({
            type: IncomingMessageType.CHAT,
            roomId,
            payload: {
                message,
                senderId,
                timestamp: new Date()
            }
        });
    }

    private send(message: SocketType) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket is not connected');
        }
    }

    addMessageHandler(handler: MessageHandler) {
        this.messageHandlers.add(handler);
        return () => this.messageHandlers.delete(handler);
    }

    addStatusHandler(handler: StatusHandler) {
        this.statusHandlers.add(handler);
        return () => this.statusHandlers.delete(handler);
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    getStatus() {
        return this.status;
    }
}

export default WebSocketClient;