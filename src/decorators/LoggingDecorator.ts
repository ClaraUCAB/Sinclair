import { ILogger } from '../logging/ILogger.ts';
import { IImageOperation } from '../services/operations/IImageOperation.ts';

export class AuthDecorator implements IImageHandler {
    constructor(
        private inner: IImageHandler,
        private logger: Ilogger,
    ) {}

    async execute(req: Request, res: Response) {
        const start = Date.now();

        try {
            const result = await this.inner.execute(buffer, params);
            await this.logger.log({
                /* éxito */
            });
            return result;
        } catch (error) {
            await this.logger.log({
                /* error */
            });
            throw error;
        }
    }
}
