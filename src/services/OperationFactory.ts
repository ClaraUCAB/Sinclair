import type { IImageOperation } from './operations/IImageOperation';
import { ResizeOperation } from './operations/ResizeOperation';
import { CropOperation } from './operations/CropOperation';
import { FormatOperation } from './operations/FormatOperation';
import { RotateOperation } from './operations/RotateOperation';
import { FilterOperation } from './operations/FilterOperation';
import { PipelineOperation } from './operations/PipelineOperation';

export class OperationFactory {
	private operations: Map<string, IImageOperation> = new Map();

	constructor() {
		this.operations.set('resize', new ResizeOperation());
		this.operations.set('crop', new CropOperation());
		this.operations.set('format', new FormatOperation());
		this.operations.set('rotate', new RotateOperation());
		this.operations.set('filter', new FilterOperation());
		this.operations.set('pipeline', new PipelineOperation());
	}

	getOperation(operation: string): IImageOperation {
		const op = this.operations.get(operation);
		if (!op) throw new Error(`Unknown operation: ${operation}`);
		return op;
	}
}
