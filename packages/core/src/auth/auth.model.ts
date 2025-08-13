import { z } from 'zod';

import { User, UserConstant } from '@/user';

export type BasicCredential = z.infer<typeof BasicCredential>;
export const BasicCredential = z.object({
  __type: z.literal('Basic'),
  username: User.shape.username.unwrap(),
  password: z
    .string()
    .min(UserConstant.PASSWORD_MIN_LENGTH)
    .max(UserConstant.PASSWORD_MAX_LENGTH),
});

export type BearerCredential = z.infer<typeof BearerCredential>;
export const BearerCredential = z.object({
  __type: z.literal('Bearer'),
  token: z.string().trim().nonempty(),
});

export type Credential = z.infer<typeof Credential>;
export const Credential = z.union([BasicCredential, BearerCredential]);

export type AuthUser = z.infer<typeof AuthUser>;
export const AuthUser = z.object({
  userId: User.shape.id,
  username: User.shape.username,
  userName: User.shape.name,
  userEmail: User.shape.email,
  userRole: User.shape.role,
});

export type AuthContext<Verified extends boolean = boolean> = {
  credential: Verified extends true ? Credential : undefined;
  authUser: Verified extends true ? AuthUser : undefined;
  network: {
    ipFamily: 4 | 6;
    ipAddress: string;
  };
};
