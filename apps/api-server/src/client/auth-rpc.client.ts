import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import {
  type ChangePasswordPayload,
  type IAuthService,
  type RefreshPayload,
  type SignInPayload,
  type SignUpPayload,
  type VerifyCredentialPayload,
  AuthUser,
  User,
} from '@template/core';
import { firstValueFrom, take, timeout } from 'rxjs';

@Injectable()
export class AuthRpcClient implements IAuthService {
  private readonly logger = new Logger(AuthRpcClient.name);

  constructor(@Inject('AuthRpcProxy') private readonly clientProxy: ClientProxy) {
    // do nothing
  }

  async signUp(payload: SignUpPayload): Promise<User> {
    const result = this.clientProxy
      .send<ReturnType<this['signUp']>>('signUp', payload)
      .pipe(timeout(10_000))
      .pipe(take(1));

    const user = await firstValueFrom(result);

    return User.parse(user);
  }

  async signIn(
    payload: SignInPayload,
  ): Promise<{ accessToken: string; refreshToken: string; authUser: AuthUser }> {
    const result = this.clientProxy
      .send<ReturnType<this['signIn']>>('signIn', payload)
      .pipe(timeout(10_000))
      .pipe(take(1));

    const _result = await firstValueFrom(result);

    return _result;
  }

  async hashPassword(password: string): Promise<string> {
    const result = this.clientProxy
      .send<ReturnType<this['hashPassword']>>('hashPassword', password)
      .pipe(timeout(10_000))
      .pipe(take(1));

    const hash = await firstValueFrom(result);

    return hash;
  }

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    const result = this.clientProxy
      .send<Awaited<ReturnType<this['changePassword']>>>('changePassword', { payload })
      .pipe(timeout(10_000))
      .pipe(take(1));

    await firstValueFrom(result);
  }

  async refresh(
    payload: RefreshPayload,
  ): Promise<{ accessToken: string; refreshToken: string; authUser: AuthUser }> {
    const result = this.clientProxy
      .send<ReturnType<this['refresh']>>('refresh', payload)
      .pipe(timeout(10_000))
      .pipe(take(1));

    const _result = await firstValueFrom(result);

    return _result;
  }

  async verifyCredential(payload: VerifyCredentialPayload): Promise<AuthUser> {
    const result = this.clientProxy
      .send<ReturnType<this['verifyCredential']>>('verifyCredential', { payload })
      .pipe(timeout(10_000))
      .pipe(take(1));

    const authUser = await firstValueFrom(result);

    return AuthUser.parse(authUser);
  }
}
