import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Hub } from '../dal/entity/hub.entity';
import { JoinUserHub } from '../dal/entity/joinUserHub.entity';
import { User } from '../dal/entity/user.entity';
import { ModerationService } from './moderation.service';
import { ModerationResolver } from './moderation.resolver';
import { HubModule } from '../hub/hub.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([JoinUserHub, User, Hub]),
    HubModule
  ],
  providers: [ModerationService, ModerationResolver]
})
export class ModerationModule {}
