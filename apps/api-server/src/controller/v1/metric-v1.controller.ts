import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Metrics')
@Controller('metrics/v1')
export class MetricV1Controller {
  constructor() {
    // do nothing
  }

  /**
   * @internal
   */
  @Get('health')
  @Header('content-type', 'text/plain')
  health(): string {
    return 'ok';
  }
}
