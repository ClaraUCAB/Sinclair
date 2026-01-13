export enum LogLevel {
	Debug,
	Info,
	Warn,
	Error,
	Critical,
}

export enum OperationResult {
	Success,
	Failure,
}

export interface LogEntry {
	timestamp: Date; // FIX: Maybe Time?
	level: LogLevel;
	userEmail: string;
	endpoint: string;
	parameters: Record<string, string>; // FIX: Probably use a generic here. Record<string, T>?
	executionTime: number;
	result: OperationResult;
	message?: string;
}

export interface ILogger {
	log(entry: LogEntry): Promise<void>;
}
