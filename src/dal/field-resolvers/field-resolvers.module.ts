import { Module } from '@nestjs/common';
import { FileModule } from '../../file/file.module';
import { DataloadersModule } from '../dataloaders/dataloaders.module';
import { BlockFieldResolver } from './block-field.resolver';
import { EventFieldResolver } from './event-field.resolver';
import { FileFieldResolver } from './file-field.resolver';
import { HubFieldResolver } from './hub-field.resolver';
import { InAppNotificationFieldResolver } from './inAppNotification-field.resolver';
import { InviteFieldResolver } from './invite-field.resolver';
import { JoinUserEventFieldResolver } from './joinUserEvent-field.resolver';
import { JoinUserHubsResolver as JoinUserHubsFieldResolver } from './joinUserHub-field.resolver';
import { MicroChatFieldResolver } from './microChat-field.resolver';
import { UserFieldResolver } from './user-field.resolver';
import { UserDeviceFieldResolver } from './userDevice-field.resolver';

@Module({
  imports: [
    FileModule,
    DataloadersModule,
  ],
  providers: [
    JoinUserHubsFieldResolver,
    HubFieldResolver,
    UserFieldResolver,
    InAppNotificationFieldResolver,
    MicroChatFieldResolver,
    UserDeviceFieldResolver,
    InviteFieldResolver,
    BlockFieldResolver,
    JoinUserEventFieldResolver,
    EventFieldResolver,
    FileFieldResolver,
  ],
})
export class FieldResolversModule {}
