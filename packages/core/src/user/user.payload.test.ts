import { util } from 'zod/v4/core';

import type { UserRole } from './user.model.js';
import type {
  CreateUserPayload,
  DeleteUserPayload,
  FindUserByIdPayload,
  FindUserByUsernamePayload,
  FindUserOptions,
  FindUserPayload,
  QueryUsersPayload,
  UpdateUserPayload,
} from './user.payload.js';

describe('core.user.payload build:spec', () => {
  describe('type inference', () => {
    test('CreateUserPayload type inference', () => {
      util.assertEqual<
        CreateUserPayload,
        {
          username?: string | null;
          passwordHash?: string | null;

          name?: string | null;
          email?: string | null;
          phone?: string | null;
          role?: UserRole;
        }
      >(true);
    });

    test('FindUserOptions type inference', () => {
      util.assertEqual<
        FindUserOptions,
        {
          withDeleted?: boolean;

          includePasswordHash?: boolean;
          includePasswordChangedAt?: boolean;
        }
      >(true);
    });

    test('FindUserByIdPayload type inference', () => {
      util.assertEqual<
        FindUserByIdPayload,
        {
          id: number;
        }
      >(true);
    });

    test('FindUserByUsernamePayload type inference', () => {
      util.assertEqual<
        FindUserByUsernamePayload,
        {
          username: string;
        }
      >(true);
    });

    test('FindUserPayload type inference', () => {
      util.assertEqual<FindUserPayload, FindUserByIdPayload | FindUserByUsernamePayload>(
        true,
      );
    });

    test('QueryUsersPayload type inference', () => {
      util.assertEqual<
        QueryUsersPayload,
        {
          ids?: number[];

          role?: UserRole;
          createdSince?: Date;
          createdUntil?: Date;
          usernameLike?: string | null;

          sort?: 'latest' | 'oldest';
          page?: number;
          count?: number;
        }
      >(true);
    });

    test('UpdateUserPayload type inference', () => {
      util.assertEqual<
        UpdateUserPayload,
        {
          id: number;

          role?: UserRole;
          passwordHash?: string | null;

          name?: string | null;
          email?: string | null;
          phone?: string | null;
        }
      >(true);
    });

    test('DeleteUserPayload type inference', () => {
      util.assertEqual<
        DeleteUserPayload,
        {
          id: number;
        }
      >(true);
    });
  });
});
