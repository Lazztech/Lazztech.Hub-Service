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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { GoogleController } from './controller/google.controller';
import { GoogleStrategy } from './strategy/google.strategy';
@Module({
  controllers: [GoogleController],
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
    }),
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
  providers: [AuthResolver, AuthService, AuthPasswordResetService, JwtStrategy, GoogleStrategy],
})
export class AuthModule {}
