import { Controller } from '@nestjs/common';
import { OpenGraphService } from './open-graph.service';

@Controller('open-graph')
export class OpenGraphController {
  constructor(private readonly openGraphService: OpenGraphService) {}
}
