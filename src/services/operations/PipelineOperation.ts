import type { ImageParams } from '../../types';
import type { IImageOperation } from './IImageOperation';
import { ResizeOperation } from './ResizeOperation';
import { CropOperation } from './CropOperation';
import { FormatOperation } from './FormatOperation';
import { RotateOperation } from './RotateOperation';
import { FilterOperation } from './FilterOperation';
import { HTTPError } from '../../types/error';

export class PipelineOperation implements IImageOperation {
	private operations: Map<string, IImageOperation> = new Map();

	constructor() {
		this.operations.set('resize', new ResizeOperation());
		this.operations.set('crop', new CropOperation());
		this.operations.set('format', new FormatOperation());
		this.operations.set('rotate', new RotateOperation());
		this.operations.set('filter', new FilterOperation());
		//this.operations.set('pipeline', this); No.
	}

	getOperation(operation: string): IImageOperation {
		// 418 I'm a teapot
		if (operation === 'pipeline')
			throw new HTTPError("No puedes utilizar 'pipeline' en pipeline. Chistosito.", 418);

		const op = this.operations.get(operation);
		if (!op) throw new Error(`Unknown operation: ${operation}`);

		return op;
	}

	async execute(buffer: Buffer, params: ImageParams): Promise<Buffer> {
		// No operation specified
		if (!params.operations) return buffer;

		for (const operation of params.operations) {
			buffer = await this.getOperation(operation).execute(buffer, params);
		}

		return buffer;
	}
}
