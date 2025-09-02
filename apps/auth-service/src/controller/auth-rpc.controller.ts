import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import type { IAuthService } from '@template/core';

@Controller()
export class AuthRpcController {
  constructor(@Inject('AuthService') private readonly authService: IAuthService) {
    // do nothing
  }

  @MessagePattern('signUp')
  async signUp({
    payload,
  }: {
    payload: Parameters<IAuthService['signUp']>[0];
  }): ReturnType<IAuthService['signUp']> {
    return await this.authService.signUp(payload);
  }

  @MessagePattern('signIn')
  async signIn({
    payload,
  }: {
    payload: Parameters<IAuthService['signIn']>[0];
  }): ReturnType<IAuthService['signIn']> {
    return await this.authService.signIn(payload);
  }

  @MessagePattern('hashPassword')
  async hashPassword({
    password,
  }: {
    password: Parameters<IAuthService['hashPassword']>[0];
  }): ReturnType<IAuthService['hashPassword']> {
    return await this.authService.hashPassword(password);
  }

  @MessagePattern('refresh')
  async refresh({
    payload,
  }: {
    payload: Parameters<IAuthService['refresh']>[0];
  }): ReturnType<IAuthService['refresh']> {
    return await this.authService.refresh(payload);
  }

  @MessagePattern('verifyCredential')
  async verifyCredential({
    credential,
  }: {
    credential: Parameters<IAuthService['verifyCredential']>[0];
  }): ReturnType<IAuthService['verifyCredential']> {
    return await this.authService.verifyCredential(credential);
  }
}
