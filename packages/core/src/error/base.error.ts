export interface BaseErrorOptions {
  httpStatus?: number;
}

export class BaseError extends Error {
  code: number;
  options?: BaseErrorOptions;

  constructor(name: string, code: number, message: string, options?: BaseErrorOptions) {
    super(message);

    this.name = name;
    this.code = code;
    this.options = options;
  }
}
