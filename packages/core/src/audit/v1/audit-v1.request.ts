import { z } from 'zod';

import {
  FindAuditByIdPayload,
  FindAuditOptions,
  QueryAuditsPayload,
} from '../audit.payload';

///////////////////////////////////
//              Find
///////////////////////////////////

export type FindAuditV1RequestOptions = z.infer<typeof FindAuditV1RequestOptions>;
export const FindAuditV1RequestOptions = z.object({
  // Relations
  includeUser: FindAuditOptions.shape.includeUser,
});

export type FindAuditByIdV1Request = z.infer<typeof FindAuditByIdV1Request>;
export const FindAuditByIdV1Request = z.object({
  id: FindAuditByIdPayload.shape.id,
});

export type QueryAuditsV1Request = z.infer<typeof QueryAuditsV1Request>;
export const QueryAuditsV1Request = z.object({
  ids: QueryAuditsPayload.shape.ids,

  userId: QueryAuditsPayload.shape.userId,
  createdSince: z.iso
    .datetime()
    .pipe(z.transform((v) => QueryAuditsPayload.shape.createdSince.parse(v)))
    .optional(),
  createdUntil: z.iso
    .datetime()
    .pipe(z.transform((v) => QueryAuditsPayload.shape.createdUntil.parse(v)))
    .optional(),
  service: QueryAuditsPayload.shape.service,
  action: QueryAuditsPayload.shape.action,
  successful: z.stringbool().nullable().optional(),

  sort: QueryAuditsPayload.shape.sort,
  page: QueryAuditsPayload.shape.page,
  count: QueryAuditsPayload.shape.count,
});
