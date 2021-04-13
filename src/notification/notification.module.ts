import { Module, HttpModule } from '@nestjs/common';
import { NotificationResolver } from './notification.resolver';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JoinUserInAppNotifications } from '../dal/entity/joinUserInAppNotifications.entity';
import { User } from '../dal/entity/user.entity';
import { UserDevice } from '../dal/entity/userDevice.entity';
import { InAppNotification } from '../dal/entity/inAppNotification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      InAppNotification,
      JoinUserInAppNotifications,
      UserDevice,
    ]),
    HttpModule,
  ],
  controllers: [],
  providers: [NotificationResolver, NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
