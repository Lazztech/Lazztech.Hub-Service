import { Controller, Get, Param} from '@nestjs/common';
import { OpenGraphService } from './open-graph.service';

@Controller('open-graph')
export class OpenGraphController {

  constructor(
    private readonly openGraphService: OpenGraphService
  ) {}

  @Get('/title/:shareableId')
  getTitle(@Param('shareableId') shareableId: string) {
    return shareableId;
  }

  @Get('/description/:shareableId')
  getDescription(@Param('shareableId') shareableId: string) {
    return shareableId;
  }

  @Get('/image/:shareableId')
  getImage(@Param('shareableId') shareableId: string) {
    return shareableId;
  }

}
