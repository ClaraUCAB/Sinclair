import type { IImageHandler } from '../handlers/IImageHandler';
import { ILogger, OperationResult, LogLevel } from '../logging/ILogger';
import type { IImageOperation } from '../services/operations/IImageOperation';
import type { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class LoggingDecorator implements IImageHandler {
	constructor(
		private inner: IImageHandler,
		private logger: ILogger,
	) {}

	async execute(req: Request, res: Response) {
		let start = new Date();
		let inicio = performance.now();

		const jwt = req.get('Authorization').replace('Bearer ', '');
		const correo = await AuthService.getEmailFromJWT(jwt);

		try {
			const result = await this.inner.execute(req, res);

			const final = performance.now();

			await this.logger.log({
				timestamp: start,
				level: LogLevel.Info,
				userEmail: correo,
				endpoint: req.originalUrl,
				parameters: req.body,
				executionTime: parseFloat((final - inicio).toFixed(2)),
				result: OperationResult.Success,
			});

			return result;
		} catch (error) {
			let final = performance.now();

			await this.logger.log({
				timestamp: start,
				level: LogLevel.Error,
				userEmail: correo,
				endpoint: req.originalUrl,
				parameters: req.body,
				executionTime: final - inicio,
				result: OperationResult.Failure,
				message: error.message,
			});

			throw error;
		}
	}

	async getCorreo() {}
}
