import { util } from 'zod/v4/core';

import type { User } from '../user.model';
import type {
  CreateUserV1Response,
  FindUserV1Response,
  QueryUsersV1Response,
} from './user-v1.response';

describe('core.user.v1.response build:spec', () => {
  describe('type inference', () => {
    test('CreateUserV1Response type inference', () => {
      util.assertEqual<
        CreateUserV1Response,
        {
          user: User;
        }
      >(true);
    });

    test('FindUserV1Response type inference', () => {
      util.assertEqual<
        FindUserV1Response,
        {
          user: User;
        }
      >(true);
    });

    test('QueryUsersV1Response type inference', () => {
      util.assertEqual<
        QueryUsersV1Response,
        {
          users: User[];
        }
      >(true);
    });
  });
});
