import type { Server } from 'node:http';

import 'winston-daily-rotate-file';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { type NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

import { type AppConfig, LOGGING_LEVEL } from './app.config';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const loggingLevel = process.env.LOGGING_LEVEL
    ? LOGGING_LEVEL.find((v) => v === process.env.LOGGING_LEVEL)
    : 'info';
  if (!loggingLevel) {
    throw new Error(
      `Invalid environment: LOGGING_LEVEL=${process.env.LOGGING_LEVEL}, availables=[${String(LOGGING_LEVEL.join(', '))}]`,
    );
  }

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: WinstonModule.createLogger({
        level: loggingLevel,
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSSZ' }),
          winston.format.printf(
            (info) =>
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-base-to-string
              `${info.timestamp} ${info.level.toUpperCase().padStart(6)} [${info.context || ''}]: ${info.message}`,
          ),
        ),
        transports: [
          new winston.transports.DailyRotateFile({
            filename: 'logs/api-server-%DATE%.log',
            maxFiles: '30d',
          }),
          new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize({ all: true })),
          }),
        ],
      }),
    },
  );

  const config = app.get(ConfigService<AppConfig, true>);

  initApplication(app, config);

  const host = config.getOrThrow<string>('HOST');
  const port = config.getOrThrow<number>('PORT');

  await app.listen(port, host);

  Logger.log(`Listening at http://${host}:${port}`);
}

bootstrap().catch((error: Error) => {
  Logger.error(`Error occured while bootstraping the server: ${error}`, error.stack);
});

function initApplication(
  app: NestFastifyApplication,
  config: ConfigService<AppConfig, true>,
): NestFastifyApplication {
  // API
  app.setGlobalPrefix(config.getOrThrow('API_PREFIX') || '');
  const cors = config.getOrThrow<string[]>('CORS');
  if (cors.length) {
    app.enableCors({
      origin: cors,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    });
  }

  // HTTP
  const httpServer = app.getHttpServer() as Server;
  httpServer.setTimeout(config.getOrThrow('HTTP_SOCKET_TIMEOUT'));
  httpServer.requestTimeout = config.getOrThrow('HTTP_REQUEST_TIMEOUT');
  httpServer.headersTimeout = config.getOrThrow('HTTP_HEADERS_TIMEOUT');
  httpServer.keepAliveTimeout = config.getOrThrow('HTTP_KEEP_ALIVE_TIMEOUT');

  // Swagger
  initSwagger(app, config);

  // Signal
  app.enableShutdownHooks();

  return app;
}

function initSwagger(
  app: NestFastifyApplication,
  config: ConfigService<AppConfig, true>,
): NestFastifyApplication {
  const isSwaggerEnabled = config.get<boolean>('SWAGGER_ENABLE', false);
  if (!isSwaggerEnabled) {
    return app;
  }

  // TODO: Init swagger
  // const env = config.getOrThrow<NodeEnv>('NODE_ENV');
  // const port = config.getOrThrow<number>('PORT');
  //
  // const { SwaggerModule } = await import('@nestjs/swagger');
  // const { NestiaSwaggerComposer } = await import('@nestia/sdk');
  //
  // const swaggerPath = path.join(config.get('API_PREFIX') || '', '/docs');
  // const document = await NestiaSwaggerComposer.document(app, {
  //   openapi: '3.1',
  //   info: {
  //     title: `[${env}] API Server`,
  //     description: 'API Server Swagger.',
  //     version: version,
  //   },
  //   security: {
  //     bearer: {
  //       type: 'http',
  //       scheme: 'bearer',
  //     },
  //   },
  //   servers: [
  //     {
  //       url: `http://localhost:${port}`,
  //       description: 'Localhost',
  //     },
  //     {
  //       url: `http://localhost:8080`,
  //       description: 'Localhost Nginx',
  //     },
  //   ],
  // });

  // SwaggerModule.setup(swaggerPath, app, document as any);

  return app;
}
