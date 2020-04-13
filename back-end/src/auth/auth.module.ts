import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { PasswordReset } from 'src/dal/entity/passwordReset.entity';
import { User } from 'src/dal/entity/user.entity';
import { InAppNotification } from 'src/dal/entity/inAppNotification.entity';
import { JoinUserInAppNotifications } from 'src/dal/entity/joinUserInAppNotifications.entity';
import { ServicesModule } from 'src/services/services.module';
import { AuthPasswordResetService } from './auth-password-reset/auth-password-reset.service';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PasswordReset,
            User,
            InAppNotification,
            JoinUserInAppNotifications,
        ]),
        ServicesModule,
        NotificationModule,
    ],
    providers: [
        AuthResolver,
        AuthService,
        AuthPasswordResetService
    ]
})
export class AuthModule {}
