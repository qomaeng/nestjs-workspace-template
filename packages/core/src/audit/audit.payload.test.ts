import { util } from 'zod/v4/core';

import type {
  FindAuditByIdPayload,
  FindAuditOptions,
  FindAuditPayload,
  QueryAuditsPayload,
  RegisterAuditPayload,
  UpdateAuditPayload,
} from './audit.payload';

describe('core.audit.payload build:spec', () => {
  describe('type inference', () => {
    test('RegisterAuditPayload type inference', () => {
      util.assertEqual<
        RegisterAuditPayload,
        {
          id?: number;

          userId: number | null;
          createdAt?: Date;

          service: string;
          action: string;
          successful?: boolean | null;
          error?: string | null;

          url: string;
          query: string;
          ipAddress: string;
          host?: string | null;
          userAgent?: string | null;
          referer?: string | null;
        }
      >(true);
    });

    test('FindAuditOptions type inference', () => {
      util.assertEqual<
        FindAuditOptions,
        {
          includeUser?: boolean;
        }
      >(true);
    });

    test('FindAuditByIdPayload type inference', () => {
      util.assertEqual<
        FindAuditByIdPayload,
        {
          id: number;
        }
      >(true);
    });

    test('FindAuditPayload type inference', () => {
      util.assertEqual<FindAuditPayload, FindAuditByIdPayload>(true);
    });

    test('QueryAuditsPayload type inference', () => {
      util.assertEqual<
        QueryAuditsPayload,
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

    test('UpdateAuditPayload type inference', () => {
      util.assertEqual<
        UpdateAuditPayload,
        {
          id: number;

          successful?: boolean | null;
          error?: string | null;
        }
      >(true);
    });
  });
});
