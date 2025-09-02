import {
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
  Injectable,
  Logger,
} from '@nestjs/common';
import { type Observable, tap } from 'rxjs';

@Injectable()
export class RpcRequestInterceptor implements NestInterceptor {
  private readonly logger = new Logger(this.constructor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const requestStartedAt = Date.now();

    const methodKey = context.getHandler().name;
    const className = context.getClass().name;

    this.logger.debug(`-> ${className}.${methodKey}`);

    return next.handle().pipe(
      tap({
        finalize: () => {
          const requestFinishedAt = Date.now();
          this.logger.log(
            `<- ${className}.${methodKey}: ${requestFinishedAt - requestStartedAt}ms`,
          );
        },
      }),
    );
  }
}
