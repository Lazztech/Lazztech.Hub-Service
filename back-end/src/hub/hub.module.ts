import { Module } from '@nestjs/common';
import { HubResolver } from './hub.resolver';
import { ServicesModule } from 'src/services/services.module';
import { HubService } from './hub.service';
import { NotificationService } from 'src/notification/notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hub } from 'src/dal/entity/hub.entity';
import { JoinUserHub } from 'src/dal/entity/joinUserHub.entity';
import { MicroChat } from 'src/dal/entity/microChat.entity';
import { User } from 'src/dal/entity/user.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { JoinUserInAppNotifications } from 'src/dal/entity/joinUserInAppNotifications.entity';
import { InAppNotification } from 'src/dal/entity/inAppNotification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Hub,
      JoinUserHub,
      JoinUserInAppNotifications,
      MicroChat,
      User,
      InAppNotification,
    ]),
    ServicesModule,
    UserModule,
  ],
  controllers: [],
  providers: [HubResolver, HubService, NotificationService, UserService],
})
export class HubModule {}
