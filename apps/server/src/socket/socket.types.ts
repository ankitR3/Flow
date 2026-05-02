export enum MessageType {
    CHAT = 'CHAT',
    SUBSCRIBE = 'SUBSCRIBE',
    UNSUBSCRIBE = 'UNSUBSCRIBE',
    ROOM_CREATED = 'ROOM_CREATED',
    ROOM_JOINED = 'ROOM_JOINED',
    ROOM_EXIT = 'ROOM_EXIT',
    ROOM_DELETED = 'ROOM_DELETED',
    TYPING = 'TYPING',
    STOP_TYPING = 'STOP_TYPING'
}

export interface Chat {
    message: string;
    timestamp: string;
    senderId: string;
}

export interface Subscribe {
    userId: string;
}

export interface RoomCreated {
    id: string;
    name: string;
    createdBy: string;
}

export interface RoomJoined {
    roomId: string;
    userId: string;
}

export interface RoomExit {
    roomId: string;
    userId: string;
}

export interface RoomDeleted {
    id: string;
}

export interface Typing {
    userId: string;
    username: string;
}

export type SocketType =
    | {
        type: MessageType.CHAT;
        roomId: string;
        payload: Chat;
    }
    | {
        type: MessageType.SUBSCRIBE;
        roomId: string;
        payload: Subscribe;
    }
    | {
        type: MessageType.UNSUBSCRIBE;
        roomId: string;
    }
    | {
        type: MessageType.ROOM_CREATED;
        roomId: string;
        payload: RoomCreated;
    }
    | {
        type: MessageType.ROOM_JOINED;
        roomId: string;
        payload: RoomJoined;
    }
    | {
        type: MessageType.ROOM_EXIT;
        roomId: string;
        payload: RoomExit;
    }
    | {
        type: MessageType.ROOM_DELETED;
        roomId: string;
        payload: RoomDeleted;
    }
    | {
        type: MessageType.TYPING;
        roomId: string;
        payload: Typing;
    }
    | {
        type: MessageType.STOP_TYPING;
        roomId: string;
        payload: Typing;
    }