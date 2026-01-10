export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	timestamp: string;
}

export interface User {
	id: string;
	email: string;
	password: string; // Almacenar hasheado (bcrypt)
	createdAt: Date;
}

type ImageApiResponse = ApiResponse<Buffer>;
type AuthApiResponse = ApiResponse<{ token: string }>;
