import { type BaseErrorOptions, BaseError } from '@/error/base.error.js';

import { UserErrorCode } from './user.constant.js';

export abstract class UserError extends BaseError {}

export class NotFoundUserError extends UserError {
  constructor(message?: string, options?: BaseErrorOptions) {
    super(
      NotFoundUserError.name,
      UserErrorCode.NOT_FOUND,
      message || 'Not found user',
      { httpStatus: 404, ...options }, // Not Found
    );
  }
}

export class DuplicatedUserError extends UserError {
  constructor(message?: string, options?: BaseErrorOptions) {
    super(
      DuplicatedUserError.name,
      UserErrorCode.DUPLICATED,
      message || 'Duplicated user',
      { httpStatus: 409, ...options }, // Conflict
    );
  }
}

export class DeletedUserError extends UserError {
  constructor(message?: string, options?: BaseErrorOptions) {
    super(
      DeletedUserError.name,
      UserErrorCode.DELETED,
      message || 'Deleted user',
      { httpStatus: 400, ...options }, // Bad Request
    );
  }
}
