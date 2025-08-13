import { type BaseErrorOptions, BaseError } from '@/error/base.error';

import { CommonErrorCode } from './common.constant';

export abstract class CommonError extends BaseError {}

export class UnknownError extends CommonError {
  constructor(message?: string, options?: BaseErrorOptions) {
    super(
      UnknownError.name,
      CommonErrorCode.UNKNOWN,
      message || 'Unknown error',
      { httpStatus: 500, ...options }, // Internal Server Error
    );
  }
}

export class UnsupportedError extends CommonError {
  constructor(message?: string, options?: BaseErrorOptions) {
    super(
      UnsupportedError.name,
      CommonErrorCode.UNSUPPORTED,
      message || 'Unsupported error',
      { httpStatus: 501, ...options }, // Not Implemented
    );
  }
}

export class InvalidArgumentsError extends CommonError {
  constructor(message?: string, options?: BaseErrorOptions) {
    super(
      InvalidArgumentsError.name,
      CommonErrorCode.INVALID_ARGUMENTS,
      message || 'Invalid arguments error',
      { httpStatus: 400, ...options }, // Bad Request
    );
  }
}
