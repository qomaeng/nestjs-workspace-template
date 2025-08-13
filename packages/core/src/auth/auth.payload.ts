import { z } from 'zod';

import { CreateUserPayload } from '@/user';

import { Credential, BasicCredential, BearerCredential } from './auth.model';

export type SignUpPayload = z.infer<typeof SignUpPayload>;
export const SignUpPayload = z.object({
  username: BasicCredential.shape.username,
  password: BasicCredential.shape.password,

  name: CreateUserPayload.shape.name.unwrap().unwrap(),
  email: CreateUserPayload.shape.email.unwrap().unwrap(),
});

export type SignInPayload = z.infer<typeof SignInPayload>;
export const SignInPayload = z.object({
  username: SignUpPayload.shape.username,
  password: SignUpPayload.shape.password,
});

export type ChangePasswordPayload = z.infer<typeof ChangePasswordPayload>;
export const ChangePasswordPayload = z.object({
  username: SignInPayload.shape.username,
  password: SignInPayload.shape.password,
  newPassword: SignInPayload.shape.password,
});

export type RefreshPayload = z.infer<typeof RefreshPayload>;
export const RefreshPayload = z.object({
  refreshToken: BearerCredential.shape.token,
});

export type VerifyCredentialPayload = z.infer<typeof VerifyCredentialPayload>;
export const VerifyCredentialPayload = Credential;
