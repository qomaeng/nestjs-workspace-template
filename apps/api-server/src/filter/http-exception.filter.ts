import {
  type ArgumentsHost,
  type ExceptionFilter,
  type OnModuleInit,
  Catch,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  type ErrorResponse,
  AuthenticationError,
  BaseError,
  CommonErrorCode,
  HttpUtil,
  InvalidArgumentsError,
  UnauthorizedError,
  UnknownError,
} from '@template/core';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

import type { AppConfig } from '../app.config';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter, OnModuleInit {
  private readonly logger = new Logger(this.constructor.name);

  private printErrorStack: boolean = false;
  private ignoreUrls: RegExp[] = [];
  private ignoreErrors: string[] = [];

  constructor(private readonly configService: ConfigService<AppConfig, true>) {
    // do nothing
  }

  onModuleInit(): any {
    this.printErrorStack = this.configService.getOrThrow('LOGGING_ERROR_STACK');
    this.ignoreUrls = this.configService
      .getOrThrow<string[]>('LOGGING_ERROR_IGNORE_URLS')
      .map((url) => new RegExp(url));
    this.ignoreErrors = this.configService.getOrThrow('LOGGING_ERROR_IGNORE_NAMES');
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request: FastifyRequest = context.getRequest();
    const pathname = new URL(request.originalUrl, 'http://localhost').pathname;

    if (Array.isArray(exception)) {
      exception = exception[0];
    }

    // Override trivial errors
    if (exception instanceof UnauthorizedException) {
      exception = new AuthenticationError();
    } else if (exception instanceof ForbiddenException) {
      exception = new UnauthorizedError();
    } else if (exception instanceof ZodError) {
      const message = JSON.stringify(exception.format());
      exception = new InvalidArgumentsError(message);
    }

    // Log errors
    if (this.ignoreUrls.find((regex) => regex.test(pathname))) {
      // No logging when URL path is set to be ignored
    } else if (
      exception instanceof Error &&
      this.ignoreErrors.find((error) => error === exception.name)
    ) {
      // No logging when error is set to be ignored
    } else {
      const clientIp = HttpUtil.clientIp(request) || request.ip;
      this.logger.error(
        `${request.id}: ${clientIp} <- ${request.method} ${request.originalUrl}: ${
          this.printErrorStack && exception instanceof Error
            ? exception.stack
            : String(exception)
        }`,
      );
    }

    // Build error response
    let httpStatus: number;
    let error: number;
    let message: string;

    if (exception instanceof UnknownError) {
      httpStatus = exception.options?.httpStatus || HttpStatus.INTERNAL_SERVER_ERROR;
      error = exception.code;
      message = 'Unknown error';
    } else if (exception instanceof BaseError) {
      httpStatus = exception.options?.httpStatus || HttpStatus.INTERNAL_SERVER_ERROR;
      error = exception.code;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      error = CommonErrorCode.UNKNOWN;
      message = exception.message;
    } else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      error = CommonErrorCode.UNKNOWN;
      message = 'Unknown error';
    }

    const response = context.getResponse<FastifyReply>();
    const body: ErrorResponse = {
      error,
      message,
    };

    // Send error response
    response.status(httpStatus).send(body);
  }
}
