import { z } from 'zod';

import { Audit } from './audit.model.js';

///////////////////////////////////
//             Create
///////////////////////////////////

export type RegisterAuditPayload = z.infer<typeof RegisterAuditPayload>;
export const RegisterAuditPayload = z.object({
  id: Audit.shape.id.optional(),

  userId: Audit.shape.userId,
  createdAt: Audit.shape.createdAt.optional(),

  service: Audit.shape.service,
  action: Audit.shape.action,
  successful: Audit.shape.successful.optional(),
  error: Audit.shape.error.optional(),

  url: Audit.shape.url,
  query: Audit.shape.query,
  ipAddress: Audit.shape.ipAddress,
  host: Audit.shape.host.optional(),
  userAgent: Audit.shape.userAgent.optional(),
  referer: Audit.shape.referer.optional(),
});

///////////////////////////////////
//              Find
///////////////////////////////////

export type FindAuditOptions = z.infer<typeof FindAuditOptions>;
export const FindAuditOptions = z.object({
  // Relations
  includeUser: z.boolean().optional(),
});

export type FindAuditByIdPayload = z.infer<typeof FindAuditByIdPayload>;
export const FindAuditByIdPayload = z.object({
  id: Audit.shape.id,
});

export type FindAuditPayload = z.infer<typeof FindAuditPayload>;
export const FindAuditPayload = FindAuditByIdPayload;

export type QueryAuditsPayload = z.infer<typeof QueryAuditsPayload>;
export const QueryAuditsPayload = z.object({
  ids: Audit.shape.id.array().max(50).optional(),

  userId: Audit.shape.userId.optional(),
  createdSince: z.coerce.date().optional(),
  createdUntil: z.coerce.date().optional(),
  service: Audit.shape.service.optional(),
  action: Audit.shape.action.optional(),
  successful: Audit.shape.successful.optional(),

  sort: z.enum(['latest', 'oldest']).optional(),
  page: z.number().min(1).optional(),
  count: z.number().min(0).max(50).optional(),
});

///////////////////////////////////
//             Update
///////////////////////////////////

export type UpdateAuditPayload = z.infer<typeof UpdateAuditPayload>;
export const UpdateAuditPayload = z.object({
  id: Audit.shape.id,

  successful: Audit.shape.successful.optional(),
  error: Audit.shape.error.optional(),
});
