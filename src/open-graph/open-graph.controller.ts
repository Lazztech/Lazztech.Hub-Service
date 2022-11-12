import { Controller, Get, Param, Render, Req } from '@nestjs/common';
import { Request } from 'express';
import { OpenGraphService } from './open-graph.service';

@Controller()
export class OpenGraphController {
  constructor(private readonly openGraphService: OpenGraphService) {}

  @Get('hub/:shareableId')
  @Render('index')
  hub(@Param('shareableId') shareableId: string, @Req() req: Request) {
    return this.openGraphService.getHubTagValues(shareableId, req);

  }

  @Get('event/:shareableId')
  @Render('index')
  event(@Param('shareableId') shareableId: string, @Req() req: Request) {
    return this.openGraphService.getEventTagValues(shareableId, req);
  }
}
