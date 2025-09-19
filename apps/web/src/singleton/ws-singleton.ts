import WebSocketClient from "../socket/socket.font";

let wsClient: WebSocketClient | null = null;

export const getWebSocketClient = (url?: string): WebSocketClient => {

    if (!wsClient && url) {
        wsClient = new WebSocketClient(url);
    }
    if (!wsClient) {
        throw new Error('WebSocket client not initialized. Provide URL on first call.');
    }
    return wsClient;
};