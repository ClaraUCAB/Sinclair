export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	timestamp: string;
}

export enum StatusCode {
	Sucess = 200,
	InvalidParams = 400,
	InvalidJWT = 401,
	FileTooBig = 413,
	UnsupportedFormat = 415,
	InternalError = 500,
}

export interface User {
	id: string;
	email: string;
	password: string; // Almacenar hasheado (bcrypt)
	createdAt: Date;
}

export type ImageApiResponse = ApiResponse<Buffer>;
export type AuthApiResponse = ApiResponse<{ token: string }>;

export enum ImageFilter {
	Blur,
	Sharpen,
	Grayscale,
}

export interface ImageParams {
	angle?: number;
	width?: number;
	height?: number;
	left?: number;
	top?: number;
	filter?: ImageFilter | string;
	format?: string;
	fit?: any; // FIX: Chamo...
	operations?: any[]; // FIX: Diablo...
}

export interface AuthDecoratorParams extends ImageParams {
	token: string;
}
