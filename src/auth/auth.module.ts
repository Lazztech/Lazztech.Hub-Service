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
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { GqlJwtAuthGuard } from './guards/gql-jwt-auth.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_TOKEN_SECRET'),
        signOptions: { expiresIn: '60s' },
      }),
    }),
    TypeOrmModule.forFeature([
      PasswordReset,
      User,
      InAppNotification,
      JoinUserInAppNotifications,
    ]),
    ServicesModule,
    NotificationModule,
    UserModule,
  ],
  providers: [AuthResolver, AuthService, AuthPasswordResetService, JwtStrategy],
})
export class AuthModule {}
