import { util } from 'zod/v4/core';

import type { User } from '@/user/index.js';

import type { Audit } from './audit.model.js';

describe('core.audit.model build:spec', () => {
  describe('type inference', () => {
    test('Audit type inference', () => {
      util.assertEqual<
        Audit,
        {
          id: number;

          createdAt: Date;
          updatedAt: Date;

          userId: number | null;

          service: string;
          action: string;
          successful: boolean | null;
          error: string | null;

          url: string;
          query: string;
          ipAddress: string;
          host: string | null;
          userAgent: string | null;
          referer: string | null;

          // Relations
          user?: User | null;
        }
      >(true);
    });
  });
});
