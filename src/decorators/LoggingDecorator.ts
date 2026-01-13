import type { IImageHandler } from '../handlers/IImageHandler.ts';
import { ILogger, OperationResult, LogLevel } from '../logging/ILogger.ts';
import type { IImageOperation } from '../services/operations/IImageOperation.ts';
import type { Request, Response } from 'express';

export class LoggingDecorator implements IImageHandler {
	constructor(
		private inner: IImageHandler,
		private logger: ILogger,
	) {}

	async execute(req: Request, res: Response) {
		let start = new Date();
		let inicio = performance.now();
		try {
			const result = await this.inner.execute(req, res);
			//let correo = getCorreo(req.);
			let final = performance.now();
			await this.logger.log({
				timestamp: start,
				level: LogLevel.Info,
				userEmail: 'correo', //para esto tengo que decodificar el jwt, lo hago despues
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
				userEmail: 'correo', //para esto tengo que decodificar el jwt, lo hago despues
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
