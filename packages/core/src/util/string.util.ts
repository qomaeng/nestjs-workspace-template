export namespace StringUtil {
  export function splitToArray(str?: string, delim = ','): string[] {
    return !str
      ? []
      : str
          .split(delim)
          .map((s) => s.trim())
          .filter(Boolean);
  }
}
