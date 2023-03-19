import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HubResolver } from './hub.resolver';
import { HubService } from './hub.service';
import { NotificationService } from '../notification/notification.service';
import { Hub } from '../dal/entity/hub.entity';
import { JoinUserHub } from '../dal/entity/joinUserHub.entity';
import { MicroChat } from '../dal/entity/microChat.entity';
import { User } from '../dal/entity/user.entity';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { InAppNotification } from '../dal/entity/inAppNotification.entity';
import { Invite } from '../dal/entity/invite.entity';
import { HubActivityService } from './hub-activity/hub-activity.service';
import { HubGeofenceService } from './hub-geofence/hub-geofence.service';
import { HubMicroChatService } from './hub-micro-chat/hub-micro-chat.service';
import { UserDevice } from '../dal/entity/userDevice.entity';
import { HubInviteService } from './hub-invite/hub-invite.service';
import { FileModule } from '../file/file.module';
import { EmailModule } from '../email/email.module';
import { HubTasksService } from './hub-tasks/hub-tasks.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Block } from '../dal/entity/block.entity';
import { File } from 'src/dal/entity/file.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Hub,
      JoinUserHub,
      MicroChat,
      User,
      InAppNotification,
      Invite,
      UserDevice,
      Block,
      File,
    ]),
    FileModule,
    EmailModule,
    UserModule,
    HttpModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [
    HubResolver,
    HubService,
    NotificationService,
    UserService,
    HubActivityService,
    HubGeofenceService,
    HubMicroChatService,
    HubInviteService,
    HubTasksService,
  ],
  exports: [
    HubService
  ]
})
export class HubModule {}
