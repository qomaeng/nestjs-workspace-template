import { type BaseErrorOptions, BaseError } from '@/error/base.error';

import { AuthErrorCode } from './auth.constant';

export abstract class AuthError extends BaseError {}

export class AuthenticationError extends AuthError {
  constructor(message?: string, options?: BaseErrorOptions) {
    super(
      AuthenticationError.name,
      AuthErrorCode.UNAUTHENTICATED,
      message || 'Authentication error',
      { httpStatus: 401, ...options }, // Unauthorized
    );
  }
}

export class UnauthorizedError extends AuthError {
  constructor(message?: string, options?: BaseErrorOptions) {
    super(
      UnauthorizedError.name,
      AuthErrorCode.UNAUTHORIZED,
      message || 'Unauthorized error',
      { httpStatus: 403, ...options }, // Forbidden
    );
  }
}

export class ExpiredCredentialError extends AuthError {
  constructor(message?: string, options?: BaseErrorOptions) {
    super(
      ExpiredCredentialError.name,
      AuthErrorCode.EXPIRED_CREDENTIAL,
      message || 'Expired credential',
      { httpStatus: 401, ...options }, // Unauthorized
    );
  }
}

export class InvalidCredentialError extends AuthError {
  constructor(message?: string, options?: BaseErrorOptions) {
    super(
      InvalidCredentialError.name,
      AuthErrorCode.INVALID_CREDENTIAL,
      message || 'Invalid credential',
      { httpStatus: 401, ...options }, // Unauthorized
    );
  }
}
