import { createKeyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AppConfig } from './app.config';
import { UserRpcClient } from './client/user-rpc.client';
import { AuthRpcController } from './controller/auth-rpc.controller';
import { RpcRequestInterceptor } from './interceptor/rpc-request.interceptor';
import { AuthService } from './service/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: (env: Record<string, any>) => AppConfig.parse(env),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (configService: ConfigService<AppConfig, true>) => ({
        ttl: configService.getOrThrow<number>('REDIS_DEFAULT_TTL'),
        stores: [
          createKeyv({
            database: configService.getOrThrow<number>('REDIS_DB'),
            username: configService.getOrThrow<string>('REDIS_USERNAME'),
            password: configService.getOrThrow<string>('REDIS_PASSWORD'),
            socket: {
              host: configService.getOrThrow<string>('REDIS_HOST'),
              port: configService.getOrThrow<number>('REDIS_PORT'),
              reconnectStrategy: (retries): number => Math.min(retries * 50, 2000),
            },
          }),
        ],
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync([
      {
        name: 'UserRpcProxy',
        useFactory: (configService: ConfigService<AppConfig, true>) => ({
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow<string>('USER_RPC_HOST'),
            port: configService.getOrThrow<number>('USER_RPC_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService<AppConfig, true>) => ({
        privateKey: configService.getOrThrow('JWT_PRIVATE_KEY'),
        publicKey: configService.getOrThrow('JWT_PUBLIC_KEY'),
        signOptions: {
          algorithm: 'ES256',
          expiresIn: configService.get('ACCESS_TOKEN_EXPIRES_IN') || '1h',
        },
        verifyOptions: { algorithms: ['ES256'] },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthRpcController],
  providers: [
    // NestJS Components
    { provide: APP_INTERCEPTOR, useClass: RpcRequestInterceptor },

    // Clients
    UserRpcClient,

    // Services
    AuthService,
    { provide: 'AuthService', useExisting: AuthService },
    { provide: 'UserService', useExisting: UserRpcClient },
  ],
})
export class AppModule {}
