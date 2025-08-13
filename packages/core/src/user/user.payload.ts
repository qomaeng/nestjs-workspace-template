import { z } from 'zod';

import { User } from './user.model';

///////////////////////////////////
//             Create
///////////////////////////////////

export type CreateUserPayload = z.infer<typeof CreateUserPayload>;
export const CreateUserPayload = z.object({
  role: User.shape.role.optional(),
  username: User.shape.username.optional(),
  passwordHash: User.shape.passwordHash,

  name: User.shape.name.optional(),
  email: User.shape.email.optional(),
  phone: User.shape.phone.optional(),
});

///////////////////////////////////
//              Find
///////////////////////////////////

export type FindUserOptions = z.infer<typeof FindUserOptions>;
export const FindUserOptions = z.object({
  withDeleted: z.boolean().optional(),

  // Properties
  includePasswordHash: z.boolean().optional(),
  includePasswordChangedAt: z.boolean().optional(),
});

export type FindUserByIdPayload = z.infer<typeof FindUserByIdPayload>;
export const FindUserByIdPayload = z.object({
  id: User.shape.id,
});

export type FindUserByUsernamePayload = z.infer<typeof FindUserByUsernamePayload>;
export const FindUserByUsernamePayload = z.object({
  username: User.shape.username.unwrap(),
});

export type FindUserPayload = z.infer<typeof FindUserPayload>;
export const FindUserPayload = z.union([FindUserByIdPayload, FindUserByUsernamePayload]);

export type QueryUsersPayload = z.infer<typeof QueryUsersPayload>;
export const QueryUsersPayload = z.object({
  ids: User.shape.id.array().max(50).optional(),

  role: User.shape.role.optional(),
  createdSince: z.coerce.date().optional(),
  createdUntil: z.coerce.date().optional(),
  usernameLike: z.string().nullable().optional(),

  sort: z.enum(['latest', 'oldest']).optional(),
  page: z.number().min(1).optional(),
  count: z.number().min(0).max(50).optional(),
});

///////////////////////////////////
//             Update
///////////////////////////////////

export type UpdateUserPayload = z.infer<typeof UpdateUserPayload>;
export const UpdateUserPayload = z.object({
  id: User.shape.id,

  role: User.shape.role.optional(),
  passwordHash: User.shape.passwordHash.optional(),

  name: User.shape.name.optional(),
  email: User.shape.email.optional(),
  phone: User.shape.phone.optional(),
});

///////////////////////////////////
//             Delete
///////////////////////////////////

export type DeleteUserPayload = z.infer<typeof DeleteUserPayload>;
export const DeleteUserPayload = z.object({
  id: User.shape.id,
});
