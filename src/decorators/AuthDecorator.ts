import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { ApiResponse, StatusCode } from '../types/index';
import { IImageHandler } from '../handlers/IImageHandler';

export class AuthDecorator implements IImageHandler {
	constructor(
		private inner: IImageHandler,
		private authService: AuthService,
	) {}

	async execute(req: Request, res: Response) {
		let token = req.get('Authorization');

		const errorResponse: ApiResponse = {
			success: false,
			error: 'Usuario no autorizado',
			timestamp: new Date().toISOString(),
		};

		if (!token || !token.startsWith('Bearer')) {
			res.status(StatusCode.InvalidJWT).json(errorResponse);
		}

		token = token.replace('Bearer ', '');

		if (!(await this.authService.verifyJWT(token))) {
			res.status(StatusCode.InvalidJWT).json(errorResponse);
		}

		this.inner.execute(req, res);
	}
}
