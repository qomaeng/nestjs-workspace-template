import { z } from 'zod';

import { User } from '../user.model.js';

///////////////////////////////////
//             Create
///////////////////////////////////

export type CreateUserV1Response = z.infer<typeof CreateUserV1Response>;
export const CreateUserV1Response = z.object({
  user: User,
});

///////////////////////////////////
//              Find
///////////////////////////////////

export type FindUserV1Response = z.infer<typeof FindUserV1Response>;
export const FindUserV1Response = z.object({
  user: User,
});

export type QueryUsersV1Response = z.infer<typeof QueryUsersV1Response>;
export const QueryUsersV1Response = z.object({
  users: User.array(),
});
