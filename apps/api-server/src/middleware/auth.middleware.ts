import { isIPv4, isIPv6 } from 'node:net';

import { type NestMiddleware, Inject, Injectable, Logger } from '@nestjs/common';
import {
  AuthContext,
  AuthenticationError,
  AuthUser,
  BearerCredential,
  Credential,
  HttpUtil,
  IAuthService,
  UnknownError,
} from '@template/core';
import { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  constructor(@Inject('AuthService') private readonly authService: IAuthService) {
    // do nothing
  }

  async use(
    request: FastifyRequest,
    _response: FastifyReply,
    next: (error?: Error) => void,
  ): Promise<any> {
    // 기본 인증 정보 만들기
    const defaultAuthContext = this.defaultAuthContext(request);

    // 기본 인증 정보 설정하기
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (request as any).authContext = defaultAuthContext;

    // 인증 정보 추출하기
    let credential: Credential | undefined;
    try {
      credential = this.extractCredential(request);
    } catch (error: unknown) {
      this.logger.warn(`Failed to extract credential: ${String(error)}`);
    }

    // 추출한 인증 정보가 없으면 마치기
    if (!credential) {
      next();
      return;
    }

    // 추출한 인증 정보 검증하기
    let authUser: AuthUser;
    try {
      authUser = await this.authService.verifyCredential(credential);
    } catch (error: unknown) {
      this.logger.warn(`Failed to verify credential: ${String(error)}`);
      next();
      return;
    }

    // 인증 컨택스트 설정하기
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (request as any).authContext = {
      credential: credential,
      authUser: authUser,
      network: defaultAuthContext.network,
    } satisfies AuthContext<true>;

    next();
  }

  private extractCredential(request: FastifyRequest): Credential | undefined {
    const [scheme, ...values] = request.headers.authorization?.split(' ') ?? [];

    // 인증 스키마와 값이 존재하는지 확인
    if (!scheme || !values.length) {
      return undefined;
    }

    // 인증 스키마 추출
    const nomalizedScheme = (['Basic', 'Bearer'] as const).find(
      (value) => value.toLowerCase() === scheme.toLowerCase(),
    );
    if (!nomalizedScheme) {
      throw new AuthenticationError(`Unsupported auth scheme: ${scheme}`);
    }
    switch (nomalizedScheme) {
      case 'Bearer': {
        return {
          __type: 'Bearer',
          token: values.join(' '),
        } satisfies BearerCredential;
      }
      default: {
        throw new AuthenticationError(`Unsupported auth scheme: ${scheme}`);
      }
    }
  }

  private defaultAuthContext(request: FastifyRequest): AuthContext<false> {
    // 클라이언트 IP 추출하기
    const ipAddress = HttpUtil.clientIp(request) || request.ip;

    // 클라이언트 IP 패밀리 추출하기
    const ipFamily = isIPv4(ipAddress) ? 4 : isIPv6(ipAddress) ? 6 : 0;

    if (ipFamily === 0) {
      throw new UnknownError(`Failed to assume IP family: ip=${ipAddress}`);
    }

    return {
      credential: undefined,
      authUser: undefined,
      network: { ipFamily, ipAddress },
    };
  }
}
