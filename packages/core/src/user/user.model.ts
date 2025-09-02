import { z } from 'zod';

import { UserConstant } from './user.constant.js';

export type UserRole = z.infer<typeof UserRole>;
export const UserRole = z.enum(['Master', 'Admin', 'User']);

export type User = z.infer<typeof User>;
export const User = z.object({
  id: z.int(),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable().optional(),

  role: UserRole,
  username: z
    .string()
    .trim()
    .min(UserConstant.USERNAME_MIN_LENGTH)
    .max(UserConstant.USERNAME_MAX_LENGTH)
    .regex(UserConstant.USERNAME_REGEX)
    .nullable(),
  passwordHash: z
    .string()
    .trim()
    .min(UserConstant.PASSWORD_HASH_MIN_LENGTH)
    .max(UserConstant.PASSWORD_HASH_MAX_LENGTH)
    .nullable()
    .optional(),

  name: z
    .string()
    .trim()
    .min(UserConstant.NAME_MIN_LENGTH)
    .max(UserConstant.NAME_MAX_LENGTH)
    .nullable(),
  email: z
    .email()
    .min(UserConstant.EMAIL_MIN_LENGTH)
    .max(UserConstant.EMAIL_MAX_LENGTH)
    .nullable(),
  phone: z
    .string()
    .trim()
    .min(UserConstant.PHONE_MIN_LENGTH)
    .max(UserConstant.PHONE_MAX_LENGTH)
    .nullable(),

  passwordChangedAt: z.coerce.date().nullable().optional(),
});
