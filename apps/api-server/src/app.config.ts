import { StringUtil } from '@template/core';
import { z } from 'zod';

export type NodeEnv = (typeof NodeEnv)[number];
export const NodeEnv = ['production', 'staging', 'development', 'test', 'local'] as const;

export type LOGGING_LEVEL = (typeof LOGGING_LEVEL)[number];
export const LOGGING_LEVEL = ['debug', 'verbose', 'info', 'warn', 'error'] as const;

export type AppConfig = z.infer<typeof AppConfig>;
export const AppConfig = z.object({
  // NodeJS
  NODE_ENV: z.enum(NodeEnv).default('local'),

  // Application
  HOST: z.ipv4().default('127.0.0.1'),
  PORT: z.coerce.number().min(1024).max(65535).default(3000),
  CORS: z.string().transform((s) => StringUtil.splitToArray(s)),

  // API
  API_PREFIX: z.string().default('/api'),

  // Swagger
  SWAGGER_ENABLE: z.stringbool().default(false),

  // HTTP
  HTTP_SOCKET_TIMEOUT: z.coerce.number().min(0).default(30_000),
  HTTP_REQUEST_TIMEOUT: z.coerce.number().min(0).default(6_000),
  HTTP_HEADERS_TIMEOUT: z.coerce.number().min(0).default(3_000),
  HTTP_KEEP_ALIVE_TIMEOUT: z.coerce.number().min(0).default(72_000),

  // Logging
  LOGGING_LEVEL: z.enum(LOGGING_LEVEL).default('info'),
  LOGGING_ERROR_STACK: z.stringbool().default(false),
  LOGGING_ERROR_IGNORE_NAMES: z.string().transform((s) => StringUtil.splitToArray(s)),
  LOGGING_ERROR_IGNORE_URLS: z.string().transform((s) => StringUtil.splitToArray(s)),

  // Redis
  REDIS_HOST: z.string().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().min(0).max(65535).default(6379),
  REDIS_DB: z.coerce.number().min(0).default(0),
  REDIS_USERNAME: z.string().default('default'),
  REDIS_PASSWORD: z.string(),
  REDIS_DEFAULT_TTL: z.coerce.number().min(0).default(0),

  // User
  USER_RPC_HOST: z.string().trim().nonempty(),
  USER_RPC_PORT: z.coerce.number().min(1024).max(65535),

  // Auth
  AUTH_RPC_HOST: z.string().trim().nonempty(),
  AUTH_RPC_PORT: z.coerce.number().min(1024).max(65535),
});
