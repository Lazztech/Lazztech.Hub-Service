import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Hub } from '../dal/entity/hub.entity';
import { JoinUserHub } from '../dal/entity/joinUserHub.entity';
import { User } from '../dal/entity/user.entity';
import { ModerationService } from './moderation.service';
import { ModerationResolver } from './moderation.resolver';
import { HubModule } from '../hub/hub.module';
import { Event } from '../dal/entity/event.entity';
import { JoinUserEvent } from '../dal/entity/joinUserEvent.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      JoinUserHub,
      User,
      Hub,
      Event,
      JoinUserEvent,
    ]),
    HubModule
  ],
  providers: [ModerationService, ModerationResolver]
})
export class ModerationModule {}
