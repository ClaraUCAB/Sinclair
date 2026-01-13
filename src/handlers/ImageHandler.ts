import type { Request, Response } from 'express';
import sharp from 'sharp';

import { ImageService } from '../services/ImageService';
import type { ApiResponse, ImageParams } from '../types/index';
import { HTTPError } from '../types/error.ts';
import type { IImageHandler } from './IImageHandler';
import { OperationFactory } from '../services/OperationFactory';
import type { IImageOperation } from '../services/operations/IImageOperation';

import { SUPPORTED_FORMATS, MAX_FILE_SIZE, MAX_FILE_SIZE_READABLE } from '../types/index';

const REQUIRED_PARAMS = Object.freeze({
	rotate: ['angle'],
	resize: ['width', 'height'],
	filter: ['filter'],
	format: ['format'],
	crop: ['left', 'top', 'width', 'height'],
});

export class ImageHandler implements IImageHandler {
	private operationFactory: OperationFactory;
	private operation: string = '';
	private requiredParams: (keyof ImageParams)[] = [];

	constructor(private service: ImageService) {
		// FIX: No deberíamos hacer esto.
		this.operationFactory = new OperationFactory();
	}

	private async sendImage(res: Response, buffer: Buffer, filename: string) {
		const metadata = await sharp(buffer).metadata();
		const format = metadata.format || 'png';
		res.setHeader('Content-Disposition', `attachment; filename="${filename}.${format}"`);
		res.type(`image/${format}`).send(buffer);
	}

	private getParams(req: Request): ImageParams {
		const angle = Number(req.body.angle);
		const width = Number(req.body.width);
		const height = Number(req.body.height);
		const left = Number(req.body.left);
		const top = Number(req.body.top);
		const filter = req.body.filter;
		const format = req.body.format || 'png';
		const fit = req.body.fit as keyof import('sharp').FitEnum | undefined;
		const operations = req.body.operations;

		this.operation = req.originalUrl.slice(8);
		this.requiredParams = REQUIRED_PARAMS[this.operation];

		if (!SUPPORTED_FORMATS.includes(format)) throw new HTTPError(`Formato '${format}' no soportado.`, 415);

		const params: ImageParams = {
			angle: angle,
			width: width,
			height: height,
			left: left,
			top: top,
			filter: filter,
			format: format,
			fit: fit,
			operations: operations,
		};

		return params;
	}

	async execute(req: Request, res: Response) {
		const buffer = req.file?.buffer;
		if (!buffer) {
			res.status(400).json({
				success: false,
				error: 'Imagen no proporcionada',
				timestamp: new Date().toISOString(),
			});
			return;
		}

		try {
			const metadata = await sharp(buffer).metadata();

			const format = metadata.format || 'png';
			if (!SUPPORTED_FORMATS.includes(format)) throw new HTTPError(`Formato '${format}' no soportado.`, 415);

			const size: number = metadata.size || 0;
			if (size > MAX_FILE_SIZE) throw new HTTPError(`Tamaño máximo de ${MAX_FILE_SIZE_READABLE} excedido.`, 413);

			const params = this.getParams(req);

			for (const param of this.requiredParams) {
				if (!params[param]) throw new HTTPError(`El parámetro '${param}' falta o es inválido.`, 400);
			}

			const operation: IImageOperation = this.operationFactory.getOperation(this.operation);
			const result = await operation.execute(buffer, params);

			this.sendImage(res, result, 'result');
		} catch (err: HTTPError | any) {
			const response = {
				success: false,
				error: err.message,
				timestamp: new Date().toISOString(),
			};

			res.status(err.statusCode || 500).json(response);
		}
	}
}
