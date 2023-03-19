import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { InAppNotification } from '../dal/entity/inAppNotification.entity';
import { User } from '../dal/entity/user.entity';
import { UserDevice } from '../dal/entity/userDevice.entity';
import { Event } from '../dal/entity/event.entity';
import { JoinUserEvent } from '../dal/entity/joinUserEvent.entity';
import { FileModule } from '../file/file.module';
import { EventResolver } from './event.resolver';
import { EventService } from './event.service';
import { NotificationModule } from '../notification/notification.module';
import { File } from '../dal/entity/file.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Event,
      JoinUserEvent,
      User,
      InAppNotification,
      UserDevice,
      File,
    ]),
    FileModule,
    NotificationModule,
  ],
  providers: [EventResolver, EventService]
})
export class EventModule {}
