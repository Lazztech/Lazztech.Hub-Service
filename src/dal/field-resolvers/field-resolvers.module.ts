import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { FileModule } from '../../file/file.module';
import { JoinUserHub } from '../entity/joinUserHub.entity';
import { HubFieldResolver } from './hub-field.resolver';
import { InAppNotificationFieldResolver } from './inAppNotification-field.resolver';
import { JoinUserHubsResolver as JoinUserHubsFieldResolver } from './joinUserHub-field.resolver';
import { UserFieldResolver } from './user-field.resolver';

@Module({
  imports: [FileModule, MikroOrmModule.forFeature([JoinUserHub])],
  providers: [
    JoinUserHubsFieldResolver,
    HubFieldResolver,
    UserFieldResolver,
    InAppNotificationFieldResolver,
  ],
})
export class FieldResolversModule {}
