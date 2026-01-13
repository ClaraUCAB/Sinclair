import type { ILogger, LogEntry } from './ILogger.ts';

class CompositeLogger implements ILogger {
	constructor(private loggers: ILogger[]) {}

	async log(entry: LogEntry): Promise<void> {
		await Promise.all(this.loggers.map((l) => l.log(entry)));
	}
}
