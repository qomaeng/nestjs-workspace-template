import {
  type ExecutionContext,
  applyDecorators,
  createParamDecorator,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { type AuthContext, AuthenticationError } from '@template/core';
import type { FastifyRequest } from 'fastify';

import { type AuthGuardConstraint, AuthGuard } from '@/guard/auth.guard';

export function UseAuthGuard(...constraints: AuthGuardConstraint[]) {
  return applyDecorators(SetMetadata('constraints', constraints), UseGuards(AuthGuard));
}

export const ParseAuthContext = createParamDecorator(
  (verified: boolean, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const authContext = (request.raw as any).authContext as AuthContext;

    if (verified) {
      if (!authContext.credential || !authContext.authUser) {
        throw new AuthenticationError('Failed to find verified auth context');
      }
    }

    return authContext;
  },
);
