import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { ServicesModule } from 'src/services/services.module';
import { AccountResolver } from './account.resolver';
import { AuthenticationResolver } from './authentication.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InAppNotification } from 'src/dal/entity/inAppNotification.entity';
import { Invite } from 'src/dal/entity/invite.entity';
import { JoinUserInAppNotifications } from 'src/dal/entity/joinUserInAppNotifications.entity';
import { PasswordReset } from 'src/dal/entity/passwordReset.entity';
import { User } from 'src/dal/entity/user.entity';
import { JoinUserHub } from 'src/dal/entity/joinUserHub.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      InAppNotification,
      Invite,
      JoinUserInAppNotifications,
      PasswordReset,
      JoinUserHub,
    ]),
    ServicesModule,
  ],
  controllers: [],
  providers: [UserService, AccountResolver, AuthenticationResolver],
})
export class UserModule {}
