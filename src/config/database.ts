import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectDB(): Promise<void> {
    if (!MONGODB_URI) throw new Error('Falta MONGODB_URI en el .env');

    if (mongoose.connection.readyState === 1) return; // ya conectado
    await mongoose.connect(MONGODB_URI);

    console.log('[DB] MongoDB conectado');
}