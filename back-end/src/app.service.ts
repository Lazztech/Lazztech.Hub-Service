import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  //FIXME is this unused code or should I purpose it?

  logger = new Logger(AppService.name, true);
  static staticLogger = new Logger(AppService.name, true);

  getHello(): string {
    return 'Copyright Lazztech LLC';
  }
}
