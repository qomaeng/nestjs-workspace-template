import { z } from 'zod';

import { User } from '@/user/index.js';

import { AuditConstant } from './audit.constant.js';

export type Audit = z.infer<typeof Audit>;
export const Audit = z.object({
  id: z.int(),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),

  userId: User.shape.id.nullable(),

  service: z
    .string()
    .trim()
    .min(AuditConstant.SERVICE_MIN_LENGTH)
    .max(AuditConstant.SERVICE_MAX_LENGTH),
  action: z
    .string()
    .trim()
    .min(AuditConstant.ACTION_MIN_LENGTH)
    .max(AuditConstant.ACTION_MAX_LENGTH),
  successful: z.boolean().nullable(),
  error: z.string().trim().nullable(),

  url: z.string().trim().max(AuditConstant.URL_MAX_LENGTH),
  query: z.string().trim(),
  ipAddress: z.ipv4().trim().max(AuditConstant.IP_ADDRESS_MAX_LENGTH),
  host: z.string().trim().max(AuditConstant.HOST_MAX_LENGTH).nullable(),
  userAgent: z.string().trim().max(AuditConstant.USER_AGENT_MAX_LENGTH).nullable(),
  referer: z.string().trim().max(AuditConstant.REFERER_MAX_LENGTH).nullable(),

  // Relations
  user: User.nullable().optional(),
});
