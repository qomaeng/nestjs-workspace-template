import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import {
  type CreateUserPayload,
  type DeleteUserPayload,
  type FindUserOptions,
  type FindUserPayload,
  type IUserService,
  type QueryUsersPayload,
  type UpdateUserPayload,
  NotFoundUserError,
  User,
} from '@template/core';
import { firstValueFrom, take, timeout } from 'rxjs';

@Injectable()
export class UserRpcClient implements IUserService {
  private readonly logger = new Logger(UserRpcClient.name);

  constructor(@Inject('UserRpcProxy') private readonly clientProxy: ClientProxy) {
    // do nothing
  }

  async createUser(payload: CreateUserPayload): Promise<User> {
    const result = this.clientProxy
      .send<Awaited<ReturnType<this['createUser']>>>('createUser', { payload })
      .pipe(timeout(10_000))
      .pipe(take(1));

    const user = await firstValueFrom(result);

    return User.parse(user);
  }

  async findUser(
    payload: FindUserPayload,
    options?: FindUserOptions,
  ): Promise<User | null> {
    const result = this.clientProxy
      .send<Awaited<ReturnType<this['findUser']>>>('findUser', { payload, options })
      .pipe(timeout(10_000))
      .pipe(take(1));

    const user = await firstValueFrom(result);

    return user ? User.parse(user) : user;
  }

  async getUser(...args: Parameters<IUserService['findUser']>): Promise<User> {
    const user = await this.findUser(...args);
    if (!user) {
      throw new NotFoundUserError();
    }
    return user;
  }

  async queryUsers(
    payload: QueryUsersPayload,
    options?: FindUserOptions,
  ): Promise<User[]> {
    const result = this.clientProxy
      .send<Awaited<ReturnType<this['queryUsers']>>>('queryUsers', { payload, options })
      .pipe(timeout(10_000))
      .pipe(take(1));

    const users = await firstValueFrom(result);

    return users.map((user) => User.parse(user));
  }

  async updateUser(payload: UpdateUserPayload): Promise<void> {
    const result = this.clientProxy
      .send<Awaited<ReturnType<this['updateUser']>>>('updateUser', { payload })
      .pipe(timeout(10_000))
      .pipe(take(1));

    await firstValueFrom(result);
  }

  async deleteUser(payload: DeleteUserPayload): Promise<void> {
    const result = this.clientProxy
      .send<Awaited<ReturnType<this['deleteUser']>>>('deleteUser', { payload })
      .pipe(timeout(10_000))
      .pipe(take(1));

    await firstValueFrom(result);
  }
}
