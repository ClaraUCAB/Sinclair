import express from 'express';
import * as dotenv from 'dotenv';

import imageRoutes from './routes/image.routes';
import authRoutes from './routes/auth.routes';
import { connectDB } from './config/database.ts';

dotenv.config();

async function main() {
	await connectDB(); // <- ESTA LÍNEA ES LA CLAVE

	const app = express();
	app.use(express.json());

	app.use('/images', imageRoutes);
	app.use('/auth', authRoutes);

	const PORT = Number(process.env.PORT ?? 3000);
	app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
}

main().catch((err) => {
	console.error('[FATAL] No se pudo iniciar el servidor: ', err);
	process.exit(1);
});
