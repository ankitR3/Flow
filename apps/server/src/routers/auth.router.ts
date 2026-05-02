import { Router } from 'express';
import loginController from '../controllers/auth/login.controller';

const router: Router = Router();

router.post('/login', loginController);

export default router;