import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationResolver } from './authentication.resolver';
import { AuthenticationService } from './authentication.service';
import { PasswordReset } from 'src/dal/entity/passwordReset.entity';
import { User } from 'src/dal/entity/user.entity';
import { InAppNotification } from 'src/dal/entity/inAppNotification.entity';
import { JoinUserInAppNotifications } from 'src/dal/entity/joinUserInAppNotifications.entity';
import { ServicesModule } from 'src/services/services.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PasswordReset,
            User,
            InAppNotification,
            JoinUserInAppNotifications,
        ]),
        ServicesModule,
    ],
    providers: [
        AuthenticationResolver,
        AuthenticationService
    ]
})
export class AuthenticationModule {}
