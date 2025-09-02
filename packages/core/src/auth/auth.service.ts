import type { User } from '@/user/index.js';

import type { AuthUser } from './auth.model.js';
import type {
  ChangePasswordPayload,
  RefreshPayload,
  SignInPayload,
  SignUpPayload,
  VerifyCredentialPayload,
} from './auth.payload.js';

export interface IAuthService {
  signUp(payload: SignUpPayload): Promise<User>;

  signIn(
    payload: SignInPayload,
  ): Promise<{ accessToken: string; refreshToken: string; authUser: AuthUser }>;

  hashPassword(password: string): Promise<string>;

  changePassword(payload: ChangePasswordPayload): Promise<void>;

  refresh(
    payload: RefreshPayload,
  ): Promise<{ accessToken: string; refreshToken: string; authUser: AuthUser }>;

  verifyCredential(credential: VerifyCredentialPayload): Promise<AuthUser>;
}
