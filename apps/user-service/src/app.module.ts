import { createKeyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { AppConfig } from './app.config';
import { UserRpcController } from './controller/user-rpc.controller';
import { UserEntity } from './entity/user.entity';
import { RpcRequestInterceptor } from './interceptor/rpc-request.interceptor';
import { UserRepository } from './repostiroy/user.repository';
import { UserService } from './service/user.service';

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
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService<AppConfig, true>) => ({
        type: 'postgres',
        host: configService.getOrThrow('DB_HOST'),
        port: configService.getOrThrow('DB_PORT'),
        username: configService.getOrThrow('DB_USERNAME'),
        password: configService.getOrThrow('DB_PASSWORD'),
        database: configService.getOrThrow('DB_NAME'),
        schema: configService.getOrThrow('DB_SCHEMA'),
        poolSize: 30,
        logging: ['warn'],
        autoLoadEntities: true,
        namingStrategy: new SnakeNamingStrategy(),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UserRpcController],
  providers: [
    // NestJS Components
    { provide: APP_INTERCEPTOR, useClass: RpcRequestInterceptor },

    // Services
    UserService,
    { provide: 'UserService', useExisting: UserService },

    // Repositories
    UserRepository,
  ],
})
export class AppModule {}
