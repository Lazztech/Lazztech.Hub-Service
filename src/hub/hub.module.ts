import { Module, HttpModule } from '@nestjs/common';
import { HubResolver } from './hub.resolver';
import { ServicesModule } from '../services/services.module';
import { HubService } from './hub.service';
import { NotificationService } from '../notification/notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hub } from '../dal/entity/hub.entity';
import { JoinUserHub } from '../dal/entity/joinUserHub.entity';
import { MicroChat } from '../dal/entity/microChat.entity';
import { User } from '../dal/entity/user.entity';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { JoinUserInAppNotifications } from '../dal/entity/joinUserInAppNotifications.entity';
import { InAppNotification } from '../dal/entity/inAppNotification.entity';
import { Invite } from '../dal/entity/invite.entity';
import { HubActivityService } from './hub-activity/hub-activity.service';
import { HubGeofenceService } from './hub-geofence/hub-geofence.service';
import { HubMicroChatService } from './hub-micro-chat/hub-micro-chat.service';
import { UserDevice } from '../dal/entity/userDevice.entity';
import { HubInviteService } from './hub-invite/hub-invite.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Hub,
      JoinUserHub,
      JoinUserInAppNotifications,
      MicroChat,
      User,
      InAppNotification,
      Invite,
      UserDevice,
    ]),
    ServicesModule,
    UserModule,
    HttpModule,
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
  ],
})
export class HubModule {}
