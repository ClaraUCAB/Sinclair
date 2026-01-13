import { Router } from 'express';
import multer from 'multer';

import { AuthHandler } from '../handlers/AuthHandler';
import { AuthService } from '../services/AuthService';
import { LoggingDecorator } from '../decorators/LoggingDecorator';
import { AuthDecorator } from '../decorators/AuthDecorator';

const router = Router();

export const authService = new AuthService();
const handler = new AuthHandler(authService);

router.post('/register', handler.register.bind(handler));
router.post('/login', handler.login.bind(handler));

export default router;
