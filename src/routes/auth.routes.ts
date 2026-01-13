import { Router } from 'express';

import { AuthHandler } from '../handlers/AuthHandler';
import { AuthService } from '../services/AuthService';

const router = Router();

export const authService = new AuthService();
const handler = new AuthHandler(authService);

router.post('/register', handler.register.bind(handler));
router.post('/login', handler.login.bind(handler));

export default router;
