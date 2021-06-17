import { Module } from '@nestjs/common';
import { FileModule } from '../../file/file.module';
import { HubFieldResolver } from './hub-field.resolver';
import { InAppNotificationFieldResolver } from './inAppNotification-field.resolver';
import { JoinUserHubsResolver as JoinUserHubsFieldResolver } from './joinUserHub-field.resolver';
import { UserFieldResolver } from './user-field.resolver';

@Module({
  imports: [FileModule],
  providers: [
    JoinUserHubsFieldResolver,
    HubFieldResolver,
    UserFieldResolver,
    InAppNotificationFieldResolver,
  ],
})
export class FieldResolversModule {}
