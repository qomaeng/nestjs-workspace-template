import { util } from 'zod/v4/core';

import type { Credential } from './auth.model.js';
import type {
  ChangePasswordPayload,
  RefreshPayload,
  SignInPayload,
  SignUpPayload,
  VerifyCredentialPayload,
} from './auth.payload.js';

describe('core.auth.payload build:spec', () => {
  describe('type inference', () => {
    test('SignUpPayload type inference', () => {
      util.assertEqual<
        SignUpPayload,
        {
          username: string;
          password: string;

          name: string;
          email: string;
        }
      >(true);
    });

    test('SignInPayload type inference', () => {
      util.assertEqual<
        SignInPayload,
        {
          username: string;
          password: string;
        }
      >(true);
    });

    test('ChangePasswordPayload type inference', () => {
      util.assertEqual<
        ChangePasswordPayload,
        {
          username: string;
          password: string;
          newPassword: string;
        }
      >(true);
    });

    test('RefreshPayload type inference', () => {
      util.assertEqual<
        RefreshPayload,
        {
          refreshToken: string;
        }
      >(true);
    });

    test('VerifyCredentialPayload type inference', () => {
      util.assertEqual<VerifyCredentialPayload, Credential>(true);
    });
  });
});
