import { IImageOperation } from './operations/IImageOperation';
import { ResizeOperation } from './operations/ResizeOperation';
import { CropOperation } from './operations/CropOperation';
import { FormatOperation } from './operations/FormatOperation';
import { RotateOperation } from './operations/RotateOperation';
import { FilterOperation } from './operations/FilterOperation';

export class OperationFactory {
	private operations: Map<string, IImageOperation> = new Map();

	constructor() {
		this.operations.set('resize', new ResizeOperation());
		this.operations.set('crop', new CropOperation());
		this.operations.set('format', new FormatOperation());
		this.operations.set('rotate', new RotateOperation());
		this.operations.set('filter', new FilterOperation());
	}

	getOperation(operation: string): IImageOperation {
		const op = this.operations.get(operation);
		if (!op) throw new Error(`Unknown operation: ${type}`);
		return op;
	}
}
