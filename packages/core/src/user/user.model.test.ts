import { util } from 'zod/v4/core';

import type { UserRole, User } from './user.model';

describe('core.user.model build:spec', () => {
  describe('type inference', () => {
    test('UserRole type inference', () => {
      util.assertEqual<UserRole, 'Master' | 'Admin' | 'User'>(true);
    });

    test('User type inference', () => {
      util.assertEqual<
        User,
        {
          id: number;

          createdAt: Date;
          updatedAt: Date;
          deletedAt?: Date | null;

          role: UserRole;
          username: string | null;
          passwordHash?: string | null;

          name: string | null;
          email: string | null;
          phone: string | null;

          passwordChangedAt?: Date | null;
        }
      >(true);
    });
  });
});
