export class HTTPError extends Error {
	public readonly statusCode: number;
	public readonly message: string;

	constructor(message: string, statusCode: number = 401) {
		super(message);

		this.message = message;
		this.statusCode = statusCode;
	}
}
