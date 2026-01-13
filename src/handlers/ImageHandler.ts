import { Request, Response } from 'express';
import sharp from 'sharp';

import { ImageService } from '../services/ImageService';
import { ApiResponse, ImageParams } from '../types/index';
import { IImageHandler } from './IImageHandler';
import { OperationFactory } from '../services/OperationFactory';
import { IImageOperation } from '../services/operations/IImageOperation';

import { AUTH_SERVICE } from '../types/index';
import { AuthDecorator } from '../decorators/AuthDecorator';

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

export class ImageHandler implements IImageHandler {
	private operationFactory: OperationFactory;
	private operation: string = '';

	private authDecorator: AuthDecorator;

	constructor(private service: ImageService) {
		// FIX: No deberíamos hacer esto.
		this.operationFactory = new OperationFactory();
		this.authDecorator = new AuthDecorator(this, AUTH_SERVICE);
	}

	private async sendImage(res: Response, buffer: Buffer, filename: string) {
		const metadata = await sharp(buffer).metadata();
		const format = metadata.format || 'png';
		res.setHeader('Content-Disposition', `attachment; filename="${filename}.${format}"`);
		res.type(`image/${format}`).send(buffer);
	}

	private getParams(req: Request): ImageParams | null {
		try {
			const angle = Number(req.body.angle);
			const width = Number(req.body.width);
			const height = Number(req.body.height);
			const left = Number(req.body.left);
			const top = Number(req.body.top);
			const filter = req.body.filter;
			const format = req.body.format || 'png';
			const fit = req.body.fit as keyof import('sharp').FitEnum | undefined;
			const operations = req.body.operations;
			this.operation= req.originalUrl.slice(8);
			
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
		} catch (_: any) {
			return null;
		}
	}

	async execute(req: Request, res: Response) {
		const buffer = req.file?.buffer;
		const params = this.getParams(req);
		if (!buffer) {
			res.status(400).json({
				success: false,
				error: 'Imagen no proporcionada',
				timestamp: new Date().toISOString(),
			});
		}

		try {
			const operation: IImageOperation = this.operationFactory.getOperation(this.operation);
			const result = await operation.execute(buffer, params);

			this.sendImage(res, result, 'result');
		} catch (err: any) {
			const response = {
				success: false,
				error: err.message,
				timestamp: new Date().toISOString(),
			};

			res.status(400).json(response);
		}
	}

	async resize(req: Request, res: Response) {
		this.operation = 'resize';
		this.authDecorator.execute(req, res);
	}

	async crop(req: Request, res: Response) {
		this.operation = 'crop';
		this.authDecorator.execute(req, res);
	}

	async format(req: Request, res: Response) {
		this.operation = 'format';
		this.authDecorator.execute(req, res);
	}

	async rotate(req: Request, res: Response) {
		this.operation = 'rotate';
		this.authDecorator.execute(req, res);
	}

	async filter(req: Request, res: Response) {
		this.operation = 'filter';
		this.authDecorator.execute(req, res);
	}

	async pipeline(req: Request, res: Response) {
		this.operation = 'pipeline';
		this.authDecorator.execute(req, res);
	}
}
