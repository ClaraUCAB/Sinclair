import { ILogger, LogEntry } from './ILogger.ts';
import path from 'path'
import * as fs from 'fs/promises'

export class FileLogger implements ILogger {
	private readonly FilePath = path.join(__dirname, "file.log") ;
	async log(entry: LogEntry): Promise<void> {
		try {
			fs.appendFile(this.FilePath, entry.toString(), "utf8")
		} catch (error) {
			throw new error;
		}
	}
}

