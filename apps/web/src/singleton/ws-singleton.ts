import WebSocketClient from "../socket/socket.font";

let wsClient: WebSocketClient | null = null;

export const getWebSocketClient = (url?: string): WebSocketClient => {

    if (!wsClient) {
        const wsUrl = url || process.env.NEXT_PUBLIC_WS_URL;

        if (!wsUrl) {
            throw new Error('WebSocket URL not provided...');
        }
        wsClient = new WebSocketClient(wsUrl);
    }
    return wsClient;
};

export const resetWebSocketClient = () => {
    if (wsClient) {
        wsClient.disconnect();
        wsClient = null;
    }
}