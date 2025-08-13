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
  PORT: z.coerce.number().min(1024).max(65535).default(6002),

  // Logging
  LOGGING_LEVEL: z.enum(LOGGING_LEVEL).default('info'),
  LOGGING_ERROR_STACK: z.stringbool().default(false),

  // Redis
  REDIS_HOST: z.string().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().min(0).max(65535).default(6379),
  REDIS_DB: z.coerce.number().min(0).default(0),
  REDIS_USERNAME: z.string().default('default'),
  REDIS_PASSWORD: z.string(),
  REDIS_DEFAULT_TTL: z.coerce.number().min(0).default(0),

  // JWT
  JWT_PRIVATE_KEY: z.string().trim().nonempty(),
  JWT_PUBLIC_KEY: z.string().trim().nonempty(),
  ACCESS_TOKEN_EXPIRES_IN: z
    .string()
    .trim()
    .regex(/^\d(m|h|d)$/)
    .default('1h'),
  REFRESH_TOKEN_EXPIRES_IN: z
    .string()
    .trim()
    .regex(/^\d(m|h|d)$/)
    .default('7d'),

  // User
  USER_RPC_HOST: z.string().trim().nonempty(),
  USER_RPC_PORT: z.coerce.number().min(1024).max(65535),
});
