import { Router } from 'express';
import multer from 'multer';
import { ImageHandler } from '../handlers/ImageHandler.ts';
import { ImageService } from '../services/ImageService.ts';
import { LoggingDecorator } from '../decorators/LoggingDecorator.ts';
import { FileLogger } from  '../logging/FileLogger.ts'
import { AuthDecorator } from '../decorators/AuthDecorator.ts';
import { AuthService } from '../services/AuthService.ts';

const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });
const router = Router();

const handler = new ImageHandler(new ImageService());
const auth = new AuthDecorator(handler, new AuthService)
const logger = new LoggingDecorator(auth, new FileLogger);

router.post('/resize', upload.single('image'), logger.execute.bind(logger));
router.post('/crop', upload.single('image'), logger.execute.bind(logger));
router.post('/format', upload.single('image'), logger.execute.bind(logger));
router.post('/rotate', upload.single('image'), logger.execute.bind(logger));
router.post('/filter', upload.single('image'), logger.execute.bind(logger));
router.post('/pipeline', upload.single('image'), logger.execute.bind(logger));

export default router;
