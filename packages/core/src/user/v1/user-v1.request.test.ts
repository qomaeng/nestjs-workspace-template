import { util } from 'zod/v4/core';

import type {
  CreateUserV1Request,
  DeleteUserV1Request,
  FindUserByIdV1Request,
  FindUserV1RequestOptions,
  QueryUsersV1Request,
  UpdateUserV1Request,
} from './user-v1.request';
import type { UserRole } from '../user.model';

describe('core.user.v1.request build:spec', () => {
  describe('type inference', () => {
    test('CreateUserV1Request type inference', () => {
      util.assertEqual<
        CreateUserV1Request,
        {
          role?: UserRole;
          username: string;
          password?: string;

          name: string;
          email: string;
          phone?: string | null;
        }
      >(true);
    });

    test('FindUserV1RequestOptions type inference', () => {
      util.assertEqual<
        FindUserV1RequestOptions,
        {
          withDeleted?: boolean;

          includePasswordChangedAt?: boolean;
        }
      >(true);
    });

    test('FindUserByIdV1Request type inference', () => {
      util.assertEqual<
        FindUserByIdV1Request,
        {
          id: number;
        }
      >(true);
    });

    test('QueryUsersV1Request type inference', () => {
      util.assertEqual<
        QueryUsersV1Request,
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

    test('UpdateUserV1Request type inference', () => {
      util.assertEqual<
        UpdateUserV1Request,
        {
          id: number;

          role?: UserRole;
          password?: string;

          name?: string;
          email?: string;
          phone?: string | null;
        }
      >(true);
    });

    test('DeleteUserV1Request type inference', () => {
      util.assertEqual<
        DeleteUserV1Request,
        {
          id: number;
        }
      >(true);
    });
  });
});
