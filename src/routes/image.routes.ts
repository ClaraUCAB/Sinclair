import { Router } from 'express';
import multer from 'multer';
import { ImageHandler } from '../handlers/ImageHandler.ts';
import { ImageService } from '../services/ImageService.ts';
import { LoggingDecorator } from '../decorators/LoggingDecorator.ts';
import { FileLogger } from '../logging/FileLogger.ts';
import { AuthDecorator } from '../decorators/AuthDecorator.ts';
import { authService } from './auth.routes.ts';
import { MAX_FILE_SIZE } from '../types/index';

const upload = multer({ limits: { fileSize: MAX_FILE_SIZE } });
const router = Router();

const handler = new ImageHandler(new ImageService());
const auth = new AuthDecorator(handler, authService);
const logger = new LoggingDecorator(auth, new FileLogger());

router.post('/resize', upload.single('image'), logger.execute.bind(logger));
router.post('/crop', upload.single('image'), logger.execute.bind(logger));
router.post('/format', upload.single('image'), logger.execute.bind(logger));
router.post('/rotate', upload.single('image'), logger.execute.bind(logger));
router.post('/filter', upload.single('image'), logger.execute.bind(logger));
router.post('/pipeline', upload.single('image'), logger.execute.bind(logger));

export default router;
