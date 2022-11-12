import { Module } from '@nestjs/common';
import { OpenGraphService } from './open-graph.service';
import { OpenGraphController } from './open-graph.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Hub } from '../dal/entity/hub.entity';
import { Event } from '../dal/entity/event.entity';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Hub,
      Event,
    ]),
    FileModule,
  ],
  controllers: [OpenGraphController],
  providers: [OpenGraphService]
})
export class OpenGraphModule {}
