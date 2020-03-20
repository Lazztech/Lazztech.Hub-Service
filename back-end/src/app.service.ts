import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  //FIXME is this unused code or should I purpose it?

  getHello(): string {
    return 'Hello World!';
  }
}
