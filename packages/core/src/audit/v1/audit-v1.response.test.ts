import { util } from 'zod/v4/core';

import type { Audit } from '../audit.model.js';
import type { FindAuditV1Response, QueryAuditsV1Response } from './audit-v1.response.js';

describe('core.audit.v1.response build:spec', () => {
  describe('type inference', () => {
    test('FindAuditV1Response type inference', () => {
      util.assertEqual<
        FindAuditV1Response,
        {
          audit: Audit;
        }
      >(true);
    });

    test('QueryAuditsV1Response type inference', () => {
      util.assertEqual<
        QueryAuditsV1Response,
        {
          audits: Audit[];
        }
      >(true);
    });
  });
});
