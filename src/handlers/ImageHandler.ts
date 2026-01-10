import { Request, Response } from 'express';
import sharp from 'sharp';
import { ImageService } from '../services/ImageService.ts';
import { ApiResponse } from '../types/index.ts';

export class ImageHandler {
	constructor(private service: ImageService) {}

	private async sendImage(res: Response, buffer: Buffer, filename: string) {
		const metadata = await sharp(buffer).metadata();
		const format = metadata.format || 'png';
		res.setHeader('Content-Disposition', `attachment; filename="${filename}.${format}"`);
		res.type(`image/${format}`).send(buffer);
	}

	async resize(req: Request, res: Response) {
		try {
			if (!req.file?.buffer) {
				return res.status(400).json(<ApiResponse<null>>{
					success: false,
					error: 'Imagen no proporcionada',
					timestamp: new Date().toISOString(),
				});
			}

			const width = Number(req.body.width);
			const height = Number(req.body.height);
			const fit = req.body.fit as keyof import('sharp').FitEnum | undefined;

			if (!Number.isFinite(width) || !Number.isFinite(height)) {
				return res.status(400).json(<ApiResponse<null>>{
					success: false,
					error: "Parámetros inválidos: 'width' y 'height' deben ser números.",
					timestamp: new Date().toISOString(),
				});
			}

			const buffer = await this.service.resize(req.file.buffer, width, height, fit);
			await this.sendImage(res, buffer, 'resized');
		} catch (err: any) {
			res.status(400).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
		}
	}

	async crop(req: Request, res: Response) {
		try {
			if (!req.file?.buffer) {
				return res
					.status(400)
					.json({ success: false, error: 'Imagen no proporcionada', timestamp: new Date().toISOString() });
			}

			const left = Number(req.body.left);
			const top = Number(req.body.top);
			const width = Number(req.body.width);
			const height = Number(req.body.height);

			if (![left, top, width, height].every(Number.isFinite)) {
				return res
					.status(400)
					.json({ success: false, error: 'Parámetros inválidos', timestamp: new Date().toISOString() });
			}

			const buffer = await this.service.crop(req.file.buffer, left, top, width, height);
			await this.sendImage(res, buffer, 'cropped');
		} catch (err: any) {
			res.status(400).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
		}
	}

	async format(req: Request, res: Response) {
		try {
			if (!req.file?.buffer) {
				return res
					.status(400)
					.json({ success: false, error: 'Imagen no proporcionada', timestamp: new Date().toISOString() });
			}

			const format = req.body.format as 'jpeg' | 'png' | 'webp';
			if (!['jpeg', 'png', 'webp'].includes(format)) {
				return res
					.status(400)
					.json({ success: false, error: 'Formato inválido', timestamp: new Date().toISOString() });
			}

			const buffer = await this.service.format(req.file.buffer, format);
			res.setHeader('Content-Disposition', `attachment; filename="formatted.${format}"`);
			res.type(`image/${format}`).send(buffer);
		} catch (err: any) {
			res.status(400).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
		}
	}

	async rotate(req: Request, res: Response) {
		try {
			if (!req.file?.buffer) {
				return res
					.status(400)
					.json({ success: false, error: 'Imagen no proporcionada', timestamp: new Date().toISOString() });
			}

			const angle = Number(req.body.angle);
			if (!Number.isFinite(angle)) {
				return res.status(400).json({
					success: false,
					error: "Parámetro inválido: 'angle'",
					timestamp: new Date().toISOString(),
				});
			}

			const buffer = await this.service.rotate(req.file.buffer, angle);
			await this.sendImage(res, buffer, 'rotated');
		} catch (err: any) {
			res.status(400).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
		}
	}

	async filter(req: Request, res: Response) {
		try {
			if (!req.file?.buffer) {
				return res
					.status(400)
					.json({ success: false, error: 'Imagen no proporcionada', timestamp: new Date().toISOString() });
			}

			const filter = req.body.filter as 'blur' | 'sharpen' | 'grayscale';
			if (!['blur', 'sharpen', 'grayscale'].includes(filter)) {
				return res
					.status(400)
					.json({ success: false, error: 'Filtro inválido', timestamp: new Date().toISOString() });
			}

			const buffer = await this.service.filter(req.file.buffer, filter);
			await this.sendImage(res, buffer, 'filtered');
		} catch (err: any) {
			res.status(400).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
		}
	}

	async pipeline(req: Request, res: Response) {
		try {
			if (!req.file?.buffer) {
				return res
					.status(400)
					.json({ success: false, error: 'Imagen no proporcionada', timestamp: new Date().toISOString() });
			}

			let operations = req.body.operations;
			if (typeof operations === 'string') {
				try {
					operations = JSON.parse(operations);
				} catch {
					return res.status(400).json({
						success: false,
						error: "El campo 'operations' debe ser JSON válido",
						timestamp: new Date().toISOString(),
					});
				}
			}

			if (!Array.isArray(operations)) {
				return res.status(400).json({
					success: false,
					error: "El body debe incluir un array 'operations'",
					timestamp: new Date().toISOString(),
				});
			}

			const { buffer, format } = await this.service.pipeline(req.file.buffer, operations);
			res.setHeader('Content-Disposition', `attachment; filename="pipeline.${format}"`);
			res.type(`image/${format}`).send(buffer);
		} catch (err: any) {
			res.status(400).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
		}
	}
}
