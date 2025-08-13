import 'winston-daily-rotate-file';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { type NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

import { type AppConfig, LOGGING_LEVEL } from './app.config';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  // Set logging level
  const loggingLevel = process.env.LOGGING_LEVEL
    ? LOGGING_LEVEL.find((v) => v === process.env.LOGGING_LEVEL)
    : 'info';
  if (!loggingLevel) {
    throw new Error(
      `Invalid environment: LOGGING_LEVEL=${process.env.LOGGING_LEVEL}, availables=[${String(LOGGING_LEVEL.join(', '))}]`,
    );
  }

  // Init App
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
            filename: 'logs/auth-service-%DATE%.log',
            maxFiles: '30d',
          }),
          new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize({ all: true })),
          }),
        ],
      }),
    },
  );

  // Configs
  const config = app.get(ConfigService<AppConfig, true>);
  const host = config.getOrThrow<string>('HOST');
  const port = config.getOrThrow<number>('PORT');

  // Signal handler
  app.enableShutdownHooks();

  // Microservice
  app.connectMicroservice({
    transport: Transport.TCP,
    options: { host, port },
  });

  await app.startAllMicroservices();

  Logger.log(`Started microservice at ${host}:${port}`);
}

bootstrap().catch((error: Error) => {
  Logger.error(`Error occured while bootstraping the server: ${error}`, error.stack);
});
