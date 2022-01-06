import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { PasswordReset } from '../dal/entity/passwordReset.entity';
import { User } from '../dal/entity/user.entity';
import { InAppNotification } from '../dal/entity/inAppNotification.entity';
import { AuthPasswordResetService } from './auth-password-reset/auth-password-reset.service';
import { NotificationModule } from '../notification/notification.module';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { EmailModule } from '../email/email.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_TOKEN_SECRET'),
        signOptions: { expiresIn: '60s' },
      }),
    }),
    MikroOrmModule.forFeature([PasswordReset, User, InAppNotification]),
    EmailModule,
    NotificationModule,
    UserModule,
  ],
  providers: [AuthResolver, AuthService, AuthPasswordResetService, JwtStrategy],
})
export class AuthModule {}
