import { z } from 'zod';

import { UserConstant } from '../user.constant';
import {
  CreateUserPayload,
  DeleteUserPayload,
  FindUserByIdPayload,
  FindUserOptions,
  QueryUsersPayload,
  UpdateUserPayload,
} from '../user.payload';

///////////////////////////////////
//             Create
///////////////////////////////////

export type CreateUserV1Request = z.infer<typeof CreateUserV1Request>;
export const CreateUserV1Request = z.object({
  role: CreateUserPayload.shape.role,
  username: CreateUserPayload.shape.username.unwrap().unwrap(),
  password: z
    .string()
    .min(UserConstant.PASSWORD_MIN_LENGTH)
    .max(UserConstant.PASSWORD_MAX_LENGTH)
    .optional(),

  name: CreateUserPayload.shape.name.unwrap().unwrap(),
  email: CreateUserPayload.shape.email.unwrap().unwrap(),
  phone: CreateUserPayload.shape.phone,
});

///////////////////////////////////
//              Find
///////////////////////////////////

export type FindUserV1RequestOptions = z.infer<typeof FindUserV1RequestOptions>;
export const FindUserV1RequestOptions = z.object({
  withDeleted: FindUserOptions.shape.withDeleted,

  // Properties
  includePasswordChangedAt: FindUserOptions.shape.includePasswordChangedAt,
});

export type FindUserByIdV1Request = z.infer<typeof FindUserByIdV1Request>;
export const FindUserByIdV1Request = z.object({
  id: FindUserByIdPayload.shape.id,
});

export type QueryUsersV1Request = z.infer<typeof QueryUsersV1Request>;
export const QueryUsersV1Request = z.object({
  ids: QueryUsersPayload.shape.ids,

  role: QueryUsersPayload.shape.role,
  createdSince: z.iso
    .datetime()
    .pipe(z.transform((v) => QueryUsersPayload.shape.createdSince.parse(v)))
    .optional(),
  createdUntil: z.iso
    .datetime()
    .pipe(z.transform((v) => QueryUsersPayload.shape.createdUntil.parse(v)))
    .optional(),
  usernameLike: QueryUsersPayload.shape.usernameLike,

  sort: QueryUsersPayload.shape.sort,
  page: QueryUsersPayload.shape.page,
  count: QueryUsersPayload.shape.count,
});

///////////////////////////////////
//             Update
///////////////////////////////////

export type UpdateUserV1Request = z.infer<typeof UpdateUserV1Request>;
export const UpdateUserV1Request = z.object({
  id: UpdateUserPayload.shape.id,

  role: UpdateUserPayload.shape.role,
  password: z
    .string()
    .min(UserConstant.PASSWORD_MIN_LENGTH)
    .max(UserConstant.PASSWORD_MAX_LENGTH)
    .optional(),

  name: UpdateUserPayload.shape.name.unwrap().unwrap().optional(),
  email: UpdateUserPayload.shape.email.unwrap().unwrap().optional(),
  phone: UpdateUserPayload.shape.phone,
});

///////////////////////////////////
//             Delete
///////////////////////////////////

export type DeleteUserV1Request = z.infer<typeof DeleteUserV1Request>;
export const DeleteUserV1Request = z.object({
  id: DeleteUserPayload.shape.id,
});
