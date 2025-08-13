import { type CanActivate, type ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  type UserRole,
  AuthContext,
  AuthenticationError,
  UnauthorizedError,
} from '@template/core';
import type { FastifyRequest } from 'fastify';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    // do nothing
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    // 컨트롤러나 메소드에 설정된 인증/인가 제약 가져오기
    const constraints = this.reflector.get<AuthGuardConstraint[]>(
      'constraints',
      context.getHandler(),
    );

    // HTTP Request에 설정된 인증 컨택스트 가져오기
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const authContext = (request.raw as any).authContext as AuthContext | undefined;
    if (!authContext) {
      throw new AuthenticationError('인증 컨택스트를 찾을 수 없습니다');
    }

    // 설정된 인증 컨택스트가 인증/인가 제약을 통과하는지 검증하기
    try {
      validateAuthContext(authContext, constraints);
    } catch (error: unknown) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      if (error instanceof UnauthorizedError) {
        return false;
      }
      throw error;
    }

    return true;
  }
}

export type AuthGuardConstraint = {
  credentials?: ('Basic' | 'Bearer')[];
  roles?: UserRole[];
};

export function validateAuthContext(
  context: AuthContext,
  constraints?: AuthGuardConstraint[],
): void {
  if (!constraints?.length) {
    return;
  }

  for (const constraint of constraints) {
    let validCredentials = false;
    let validRoles = false;

    // 인증 정보 검증하기
    if (!constraint.credentials?.length) {
      validCredentials = true;
    } else if (context.credential) {
      if (
        constraint.credentials.includes('Basic') &&
        context.credential.__type === 'Basic'
      ) {
        validCredentials = true;
      } else if (
        constraint.credentials.includes('Bearer') &&
        context.credential.__type === 'Bearer'
      ) {
        validCredentials = true;
      }
    }

    // 유저 롤 검증하기
    if (!constraint.roles?.length) {
      validRoles = true;
    } else if (!context.authUser) {
      validRoles = false;
    } else if (constraint.roles.includes(context.authUser.userRole)) {
      validRoles = true;
    }

    // 인증/인가 제약 조합을 하나라도 통과했다면 검증 마치기
    if (validCredentials && validRoles) {
      return;
    }
  }

  // 인증한 유저가 제약을 통과 못했다면 인가 에러, 인증하지 않은 유저의 경우 인증 에러를 던지기
  throw !context.authUser ? new AuthenticationError() : new UnauthorizedError();
}
