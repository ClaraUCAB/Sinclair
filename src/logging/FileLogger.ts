import type { ILogger, LogEntry } from './ILogger';
import path from 'path';
import * as fs from 'fs/promises';

export class FileLogger implements ILogger {
	private readonly FILE_PATH = path.join(process.cwd(), '/file.log');
	async log(entry: LogEntry): Promise<void> {
		try {
			console.log(this.FILE_PATH);
			await fs.appendFile(this.FILE_PATH, JSON.stringify(entry) + '\n', 'utf8');
		} catch (error) {
			throw new error();
		}
	}
}
