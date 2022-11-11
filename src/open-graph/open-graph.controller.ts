import { Controller, Get, Param} from '@nestjs/common';
import { OpenGraphService } from './open-graph.service';

@Controller('open-graph')
export class OpenGraphController {

  constructor(
    private readonly openGraphService: OpenGraphService
  ) {}

  @Get('/title/:href')
  async getTitle(@Param('href') href: string): Promise<string> {
    return href;
  }

  @Get('/description/:href')
  async getDescription(@Param('href') href: string): Promise<string> {
    return href;
  }

  @Get('/image/:href')
  async getImage(@Param('href') href: string): Promise<string> {
    return href;
  }

}
