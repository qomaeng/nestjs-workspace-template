import { util } from 'zod/v4/core';

import type { User } from '@/user';

import type {
  RefreshV1Response,
  SignInV1Response,
  SignUpV1Response,
} from './auth-v1.response';
import type { AuthUser } from '../auth.model';

describe('core.auth.v1.response build:spec', () => {
  describe('type inference', () => {
    test('SignUpV1Response type inference', () => {
      util.assertEqual<
        SignUpV1Response,
        {
          user: User;
        }
      >(true);
    });

    test('SignInV1Response type inference', () => {
      util.assertEqual<
        SignInV1Response,
        {
          accessToken: string;
          refreshToken: string;
          authUser: AuthUser;
        }
      >(true);
    });

    test('RefreshV1Response type inference', () => {
      util.assertEqual<
        RefreshV1Response,
        {
          accessToken: string;
          refreshToken: string;
          authUser: AuthUser;
        }
      >(true);
    });
  });
});
