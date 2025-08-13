import { z } from 'zod';

import { User } from '@/user';

import { AuthUser, BearerCredential } from '../auth.model';

export type SignUpV1Response = z.infer<typeof SignUpV1Response>;
export const SignUpV1Response = z.object({
  user: User,
});

export type SignInV1Response = z.infer<typeof SignInV1Response>;
export const SignInV1Response = z.object({
  accessToken: BearerCredential.shape.token,
  refreshToken: BearerCredential.shape.token,
  authUser: AuthUser,
});

export type RefreshV1Response = z.infer<typeof RefreshV1Response>;
export const RefreshV1Response = z.object({
  accessToken: BearerCredential.shape.token,
  refreshToken: BearerCredential.shape.token,
  authUser: AuthUser,
});
