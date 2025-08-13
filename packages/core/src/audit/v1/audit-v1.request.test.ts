import { util } from 'zod/v4/core';

import type {
  FindAuditByIdV1Request,
  FindAuditV1RequestOptions,
  QueryAuditsV1Request,
} from './audit-v1.request';

describe('core.audit.v1.request build:spec', () => {
  describe('type inference', () => {
    test('FindAuditV1RequestOptions type inference', () => {
      util.assertEqual<
        FindAuditV1RequestOptions,
        {
          includeUser?: boolean;
        }
      >(true);
    });

    test('FindAuditByIdV1Request type inference', () => {
      util.assertEqual<
        FindAuditByIdV1Request,
        {
          id: number;
        }
      >(true);
    });

    test('QueryAuditsV1Request type inference', () => {
      util.assertEqual<
        QueryAuditsV1Request,
        {
          ids?: number[];

          userId?: number | null;
          createdSince?: Date;
          createdUntil?: Date;
          service?: string;
          action?: string;
          successful?: boolean | null;

          sort?: 'latest' | 'oldest';
          page?: number;
          count?: number;
        }
      >(true);
    });
  });
});
