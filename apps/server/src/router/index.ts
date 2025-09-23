import { Router } from 'express';
import signInHandler from '../handlers/user-handler/signInHanlder';
import authMiddleware from '../middleware/authMiddleware';
import createRoom from '../handlers/room-handler/createRoom';
import joinRoom from '../handlers/room-handler/joinRoom';
import deleteRoom from '../handlers/room-handler/deleteRoom';
import leaveRoom from '../handlers/room-handler/leaveRoom';
import getRoom from '../handlers/room-handler/getRoom';
import createUsername from '../handlers/user-handler/createUsername';
import getUsername from '../handlers/user-handler/getUsername';
import getRoomCheck from '../handlers/room-handler/getRoomCheck';
import sendMessage from '../handlers/chat-handler/sendMessages';
import getMessages from '../handlers/chat-handler/getMessages';

const router: Router = Router();

// user-handlers
router.post('/signin', signInHandler);
router.post('/update-username', authMiddleware, createUsername);
router.get('/get-username', authMiddleware, getUsername);

// room-handlers
router.post('/room/create-room', authMiddleware, createRoom);
router.post('/room/join-room', authMiddleware, joinRoom);
router.delete('/room/leave-room', authMiddleware, leaveRoom);
router.delete('/room/delete-room', authMiddleware, deleteRoom);

router.get('/rooms/list-rooms/:id', authMiddleware, getRoom);
router.get('/rooms/get-room-check/:id', authMiddleware, getRoomCheck);

// chat-handlers
router.post('/room/send-message', authMiddleware, sendMessage);
router.get('/room/get-messages', authMiddleware, getMessages);

export default router;