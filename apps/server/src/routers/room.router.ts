import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import createRoomController from '../controllers/room/createRoom.controller';
import joinRoomController from '../controllers/room/joinRoom.controller';
import exitRoomController from '../controllers/room/exitRoom.controller';
import deleteRoomController from '../controllers/room/deleteRoom.controller';
import getRoomController from '../controllers/room/getRoom.controller';
import roomCheckController from '../controllers/room/roomCheck.controller';
import ownerAuthMiddleware from '../middlewares/ownerAuth.middleware';
import exploreRoomsController from '../controllers/room/exploreRooms.controller';

const router: Router = Router();

router.post('/create-room', authMiddleware, createRoomController);
router.post('/join-room', authMiddleware, joinRoomController);
router.delete('/exit-room', authMiddleware, exitRoomController);
router.delete('/delete-room', authMiddleware, ownerAuthMiddleware, deleteRoomController);

router.get('/list-rooms', authMiddleware, getRoomController);
router.get('/rooms/:id', authMiddleware, roomCheckController);
router.get('/explore', authMiddleware, exploreRoomsController);

export default router;