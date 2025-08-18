import assert from 'node:assert';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import {
  AuthUser,
  BasicCredential,
  BearerCredential,
  ChangePasswordPayload,
  ExpiredCredentialError,
  IAuthService,
  InvalidCredentialError,
  IUserService,
  RefreshPayload,
  SignInPayload,
  SignUpPayload,
  UnknownError,
  UnsupportedError,
  User,
  VerifyCredentialPayload,
} from '@template/core';
import * as argon2 from 'argon2';
import { Cache } from 'cache-manager';
import ms from 'ms';
import { v4 as uuidv4 } from 'uuid';

import { AppConfig } from '@/app.config';

@Injectable()
export class AuthService implements IAuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject('UserService') private readonly userService: IUserService,
    private readonly configService: ConfigService<AppConfig, true>,
    private readonly jwtService: JwtService,
  ) {
    // do nothing
  }

  async signUp(payload: SignUpPayload): Promise<User> {
    // 매개변수 검증하기
    payload = SignUpPayload.parse(payload);

    // 비밀번호 해싱하기
    const passwordHash = await this.hashPassword(payload.password);

    // 유저 생성하기
    const user = await this.userService.createUser({
      username: payload.username,
      passwordHash,

      role: 'User',
      name: payload.name,
      email: payload.email,
    });

    this.logger.log(`New user signed-up: id=${user.id}`);

    return user;
  }

  async signIn(
    payload: SignInPayload,
  ): Promise<{ accessToken: string; refreshToken: string; authUser: AuthUser }> {
    // 매개변수 검증하기
    payload = SignInPayload.parse(payload);

    // 인증 정보 검증하기
    const authUser = await this.verifyBasicCredential({
      __type: 'Basic',
      username: payload.username,
      password: payload.password,
    });

    // Bearer 토큰 생성하기
    const tokens = await this.generateBearerTokens(authUser);

    this.logger.log(`User signed-in: id=${authUser.userId}`);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      authUser,
    };
  }

  async refresh(
    payload: RefreshPayload,
  ): Promise<{ accessToken: string; refreshToken: string; authUser: AuthUser }> {
    // 매개변수 검증하기
    payload = RefreshPayload.parse(payload);

    // 리프레쉬 토큰 검증하기
    let authUser = await this.verifyRefreshToken(payload.refreshToken);

    // 캐싱된 AuthUser 정보 갱신하기
    assert(authUser.username);
    const user = await this.userService.getUser({ username: authUser.username });

    authUser = {
      userId: user.id,
      username: user.username,
      userRole: user.role,
      userName: user.name,
      userEmail: user.email,
    };

    // 새로운 Bearer 토큰 생성하기
    const tokens = await this.generateBearerTokens(authUser);

    this.logger.log(`Bearer token was refreshed: userId=${authUser.userId}`);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      authUser,
    };
  }

  private async verifyRefreshToken(refreshToken: string): Promise<AuthUser> {
    refreshToken = refreshToken.trim();
    if (!refreshToken) {
      throw new InvalidCredentialError('Empty refresh token');
    }

    // 캐싱된 AuthUser 가져오기
    const authUser = await this.cacheManager.get<AuthUser>(
      `auth:refresh:${refreshToken}`,
    );
    if (!authUser) {
      throw new InvalidCredentialError('Invalid refresh token');
    }

    return authUser;
  }

  ///////////////////////////////////
  //           Password
  ///////////////////////////////////

  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  private async verifyPassword(digest: string, plain: Buffer | string): Promise<boolean> {
    return argon2.verify(digest, plain);
  }

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    // 매개변수 검증하기
    payload = ChangePasswordPayload.parse(payload);

    // 유저 찾기
    const user = await this.userService.getUser(
      { username: payload.username },
      { includePasswordHash: true },
    );
    if (!user.passwordHash) {
      throw new InvalidCredentialError('User has not set password');
    }

    // 현재의 비밀번호 검증하기
    if (!(await this.verifyPassword(user.passwordHash, payload.password))) {
      throw new InvalidCredentialError('Not matching with current password');
    }

    // 새로운 비밀번호로 변경하기
    const newPasswordHash = await this.hashPassword(payload.newPassword);
    await this.userService.updateUser({ id: user.id, passwordHash: newPasswordHash });

    this.logger.log(`Changed user's password: id=${user.id}`);
  }

  ///////////////////////////////////
  //           Credential
  ///////////////////////////////////

  async verifyCredential(payload: VerifyCredentialPayload): Promise<AuthUser> {
    // 매개변수 검증하기
    payload = VerifyCredentialPayload.parse(payload);

    // 인증 정보 검증하기
    if (payload.__type === 'Basic') {
      return this.verifyBasicCredential(payload);
    } else if (payload.__type === 'Bearer') {
      return this.verifyBearerCredential(payload);
    } else {
      throw new UnsupportedError('Unsupported credential type');
    }
  }

  async verifyBasicCredential(credential: BasicCredential): Promise<AuthUser> {
    // 매개변수 검증하기
    credential = BasicCredential.parse(credential);

    // 유저 찾기
    const user = await this.userService.getUser(
      { username: credential.username },
      { includePasswordHash: true },
    );
    if (!user.passwordHash) {
      throw new InvalidCredentialError('User has not set password');
    }

    // 비밀번호 검증하기
    if (!(await this.verifyPassword(user.passwordHash, credential.password))) {
      throw new InvalidCredentialError('Not matching with current password');
    }

    return {
      userId: user.id,
      username: user.username,
      userRole: user.role,
      userName: user.name,
      userEmail: user.email,
    };
  }

  async verifyBearerCredential(credential: BearerCredential): Promise<AuthUser> {
    // 매개변수 검증하기
    credential = BearerCredential.parse(credential);

    // 엑세스 토큰 검증하기
    const authUser = await this.verifyAccessToken(credential.token);

    return authUser;
  }

  private async verifyAccessToken(accessToken: string): Promise<AuthUser> {
    accessToken = accessToken.trim();
    if (!accessToken) {
      throw new InvalidCredentialError('Empty access token');
    }

    try {
      const authUser = await this.jwtService.verifyAsync<AuthUser>(accessToken);
      return authUser;
    } catch (error: unknown) {
      if (error instanceof TokenExpiredError) {
        throw new ExpiredCredentialError('Access token has been expired');
      }
      if (error instanceof JsonWebTokenError) {
        throw new InvalidCredentialError('Invalid access token');
      }
      throw new UnknownError(`Failed to verify the access token: ${String(error)}`);
    }
  }

  private async generateBearerTokens(
    authUser: AuthUser,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // 엑세스 토큰 생성하기
    const accessToken = await this.jwtService.signAsync(authUser);
    this.logger.debug(`Generated access token: userId=${authUser.userId}`);

    // 리프레쉬 토큰 생성하기
    const refreshToken = uuidv4();

    const refreshTokenTtl: ms.StringValue =
      this.configService.get('REFRESH_TOKEN_EXPIRES_IN') || '7d';

    // 리프레쉬 토큰 캐싱하기
    await this.cacheManager.set(
      `auth:refresh:${refreshToken}`,
      authUser,
      ms(refreshTokenTtl),
    );
    this.logger.debug(`Cached refresh token just generated: userId=${authUser.userId}`);

    return { accessToken, refreshToken };
  }
}
