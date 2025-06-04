import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LogRequestMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LogRequestMiddleware.name);

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, headers, query, body } = req;
    const startTime = Date.now();

    this.logger.log(`[${method}] ${originalUrl}`);
    this.logger.debug(`Headers: ${JSON.stringify(headers, null, 2)}`);

    if (method === 'GET') {
      this.logger.debug(`Query Params: ${JSON.stringify(query, null, 2)}`);
    } else {
      this.logger.debug(`Body: ${JSON.stringify(body, null, 2)}`);
    }

    // Hook into the response finish event to log the response time and status
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      this.logger.log(`[${method}] ${originalUrl} -> ${res.statusCode} (${duration}ms)`);
    });

    next();
  }
}