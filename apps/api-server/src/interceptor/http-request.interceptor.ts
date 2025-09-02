import {
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
  Injectable,
  Logger,
} from '@nestjs/common';
import { HttpUtil } from '@template/core';
import type { FastifyRequest } from 'fastify';
import { type Observable, tap } from 'rxjs';

@Injectable()
export class HttpRequestInterceptor implements NestInterceptor {
  private readonly logger = new Logger(this.constructor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const requestStartedAt = Date.now();

    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<FastifyRequest>();
    const clientIp = HttpUtil.clientIp(request);

    this.logger.debug(`${clientIp} -> ${request.method} ${request.originalUrl}`);

    return next.handle().pipe(
      tap({
        finalize: () => {
          const requestFinishedAt = Date.now();
          this.logger.log(
            `${request.id}: ${clientIp} <- ${request.method} ${request.originalUrl}: ${requestFinishedAt - requestStartedAt}ms`,
          );
        },
      }),
    );
  }
}
