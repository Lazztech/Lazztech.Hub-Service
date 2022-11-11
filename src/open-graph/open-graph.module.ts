import { Module } from '@nestjs/common';
import { OpenGraphService } from './open-graph.service';
import { OpenGraphController } from './open-graph.controller';

@Module({
  controllers: [OpenGraphController],
  providers: [OpenGraphService]
})
export class OpenGraphModule {}
