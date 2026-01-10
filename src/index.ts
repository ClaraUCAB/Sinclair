import express from 'express';
import * as dotenv from 'dotenv';

import imageRoutes from './routes/image.routes';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/images', imageRoutes);
app.use('/auth', authRoutes);


const PORT: number = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
