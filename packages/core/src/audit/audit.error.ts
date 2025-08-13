import { type BaseErrorOptions, BaseError } from '@/error/base.error';

import { AuditErrorCode } from './audit.constant';

export abstract class AuditError extends BaseError {}

export class NotFoundAuditError extends AuditError {
  constructor(message?: string, options?: BaseErrorOptions) {
    super(
      AuditError.name,
      AuditErrorCode.NOT_FOUND,
      message || 'Not found audit',
      { httpStatus: 404, ...options }, // Not Found
    );
  }
}
