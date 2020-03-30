import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  logger = new Logger(AppService.name, true);
  static staticLogger = new Logger(AppService.name, true);

  getHello(): string {
    return 'Copyright Lazztech LLC';
  }
}
