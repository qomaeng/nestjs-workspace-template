import { z } from 'zod';

import { Audit } from '../audit.model.js';

///////////////////////////////////
//              Find
///////////////////////////////////

export type FindAuditV1Response = z.infer<typeof FindAuditV1Response>;
export const FindAuditV1Response = z.object({
  audit: Audit,
});

export type QueryAuditsV1Response = z.infer<typeof QueryAuditsV1Response>;
export const QueryAuditsV1Response = z.object({
  audits: Audit.array(),
});
