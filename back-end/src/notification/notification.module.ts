import { Module } from '@nestjs/common';
import { NotificationResolver } from './notification.resolver';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JoinUserInAppNotifications } from 'src/dal/entity/joinUserInAppNotifications.entity';
import { User } from 'src/dal/entity/user.entity';
import { UserDevice } from 'src/dal/entity/userDevice.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, JoinUserInAppNotifications, UserDevice]),
  ],
  controllers: [],
  providers: [NotificationResolver, NotificationService],
})
export class NotificationModule {}
