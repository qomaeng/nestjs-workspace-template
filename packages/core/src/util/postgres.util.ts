export namespace PostgresUtil {
  export function isUniqueConstraintError(error: unknown): boolean {
    if (error instanceof Error && 'code' in error) {
      return error.code === '23505';
    }
    return false;
  }
}
