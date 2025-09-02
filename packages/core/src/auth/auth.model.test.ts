import { util } from 'zod/v4/core';

import type { UserRole } from '@/user/index.js';

import type {
  AuthUser,
  BasicCredential,
  BearerCredential,
  Credential,
} from './auth.model.js';

describe('core.auth.model build:spec', () => {
  describe('type inference', () => {
    test('BasicCredential type inference', () => {
      util.assertEqual<
        BasicCredential,
        {
          __type: 'Basic';
          username: string;
          password: string;
        }
      >(true);
    });

    test('BearerCredential type inference', () => {
      util.assertEqual<
        BearerCredential,
        {
          __type: 'Bearer';
          token: string;
        }
      >(true);
    });

    test('Credential type inference', () => {
      util.assertEqual<Credential, BasicCredential | BearerCredential>(true);
    });

    test('AuthUser type inference', () => {
      util.assertEqual<
        AuthUser,
        {
          userId: number;
          username: string | null;
          userName: string | null;
          userEmail: string | null;
          userRole: UserRole;
        }
      >(true);
    });
  });
});
