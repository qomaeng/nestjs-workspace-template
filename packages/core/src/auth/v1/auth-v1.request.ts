import { z } from 'zod';

import {
  ChangePasswordPayload,
  RefreshPayload,
  SignInPayload,
  SignUpPayload,
} from '../auth.payload.js';

export type SignUpV1Request = z.infer<typeof SignUpV1Request>;
export const SignUpV1Request = z.object({
  username: SignUpPayload.shape.username,
  password: SignUpPayload.shape.password,

  name: SignUpPayload.shape.name,
  email: SignUpPayload.shape.email,
});

export type SignInV1Request = z.infer<typeof SignInV1Request>;
export const SignInV1Request = z.object({
  username: SignInPayload.shape.username,
  password: SignInPayload.shape.password,
});

export type RefreshV1Request = z.infer<typeof RefreshV1Request>;
export const RefreshV1Request = z.object({
  refreshToken: RefreshPayload.shape.refreshToken,
});

export type ChangePasswordV1Request = z.infer<typeof ChangePasswordV1Request>;
export const ChangePasswordV1Request = z.object({
  username: ChangePasswordPayload.shape.username,
  password: ChangePasswordPayload.shape.password,
  newPassword: ChangePasswordPayload.shape.newPassword,
});
