import { util } from 'zod/v4/core';

import type {
  ChangePasswordV1Request,
  RefreshV1Request,
  SignInV1Request,
  SignUpV1Request,
} from './auth-v1.request';

describe('core.auth.v1.request build:spec', () => {
  describe('type inference', () => {
    test('SignUpV1Request type inference', () => {
      util.assertEqual<
        SignUpV1Request,
        {
          username: string;
          password: string;

          name: string;
          email: string;
        }
      >(true);
    });

    test('SignInV1Request type inference', () => {
      util.assertEqual<
        SignInV1Request,
        {
          username: string;
          password: string;
        }
      >(true);
    });

    test('RefreshV1Request type inference', () => {
      util.assertEqual<
        RefreshV1Request,
        {
          refreshToken: string;
        }
      >(true);
    });

    test('ChangePasswordV1Request type inference', () => {
      util.assertEqual<
        ChangePasswordV1Request,
        {
          username: string;
          password: string;
          newPassword: string;
        }
      >(true);
    });
  });
});
