import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Event } from '../dal/entity/event.entity';
import { JoinUserEvent } from '../dal/entity/joinUserEvent.entity';
import { FileModule } from '../file/file.module';
import { EventResolver } from './event.resolver';
import { EventService } from './event.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Event,
      JoinUserEvent,
    ]),
    FileModule,
  ],
  providers: [EventResolver, EventService]
})
export class EventModule {}
