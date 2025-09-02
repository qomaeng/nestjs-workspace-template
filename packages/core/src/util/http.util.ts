export namespace HttpUtil {
  export function clientIp<
    Req extends {
      headers: Record<string, any>;
      socket?: { remoteAddress?: string };
      connection?: { remoteAddress?: string };
      ip?: string;
    },
  >(request: Req): string | null {
    if (request.headers['x-real-ip']) {
      let xRealIp = request.headers['x-real-ip'] as string | string[] | undefined;
      xRealIp = Array.isArray(xRealIp) ? xRealIp.shift() : xRealIp;
      xRealIp = xRealIp ? parseHeader(xRealIp).pop() : undefined;
      if (xRealIp) {
        return xRealIp;
      }
    }
    if (request.headers['x-forwarded-for']) {
      let xForwardedFor = request.headers['x-forwarded-for'] as
        | string
        | string[]
        | undefined;
      xForwardedFor = Array.isArray(xForwardedFor)
        ? xForwardedFor.shift()
        : xForwardedFor;
      xForwardedFor = xForwardedFor ? parseHeader(xForwardedFor).pop() : undefined;
      if (xForwardedFor) {
        return xForwardedFor;
      }
    }
    if (request.socket?.remoteAddress) {
      return request.socket?.remoteAddress;
    }
    if (request.connection?.remoteAddress) {
      return request.connection?.remoteAddress;
    }
    if (request.ip) {
      return request.ip;
    }

    return null;
  }

  function parseHeader(header: string): string[] {
    const result: string[] = [];

    let end = header.length;
    let start = end;
    let char;

    for (let i = end - 1; i >= 0; --i) {
      char = header[i];
      if (char === ' ') {
        if (start === end) {
          start = end = i;
        }
      } else if (char === ',') {
        if (start !== end) {
          result.push(header.slice(start, end));
        }
        start = end = i;
      } else {
        start = i;
      }
    }

    if (start !== end) {
      result.push(header.substring(start, end));
    }

    return result;
  }
}
