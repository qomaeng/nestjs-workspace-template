/** Auth error codes (12xxxx) */
export namespace AuthErrorCode {
  export const UNAUTHENTICATED = 120000;
  export const UNAUTHORIZED = 120001;

  /* Credential errors (121xxx) */
  export const EXPIRED_CREDENTIAL = 121000;
  export const INVALID_CREDENTIAL = 121001;
}

export namespace AuthConstant {}
