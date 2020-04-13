import { Module, HttpModule } from '@nestjs/common';
import { NotificationResolver } from './notification.resolver';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JoinUserInAppNotifications } from 'src/dal/entity/joinUserInAppNotifications.entity';
import { User } from 'src/dal/entity/user.entity';
import { UserDevice } from 'src/dal/entity/userDevice.entity';
import { InAppNotification } from 'src/dal/entity/inAppNotification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      InAppNotification,
      JoinUserInAppNotifications, 
      UserDevice]),
      HttpModule
  ],
  controllers: [],
  providers: [NotificationResolver, NotificationService],
  exports: [NotificationService]
})
export class NotificationModule {}
